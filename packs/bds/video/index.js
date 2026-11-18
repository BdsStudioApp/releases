import { kit, h } from '../_lib/kit.js';
import * as V from '../_lib/video.js';
import * as VS from '../_lib/videoscript.js';
import * as Ch from '../_lib/characters.js';
import { library as charLibrary, avatar as charAvatar, ensureCharCss } from '../characters/index.js';
import { engineDownload, detectOs } from '../../../core/engine_dl.18c8a720c5.js';
import { pairStatus, pairBox } from '../../../core/engine_pair.1fc01ffec5.js';
import { remotePanel } from './remote.js';
const _o2 = { display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: '6px' };
const _o1 = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '6px' };
const _o3 = 'bds.video.flow';
const LS_MAP = 'bds.video.map';
const _o30 = (_o1k, _o3e) => { try { if (_o3e === undefined) return JSON.parse(localStorage.getItem(_o1k) || 'null'); localStorage.setItem(_o1k, JSON.stringify(_o3e)); } catch { } return null; };
export async function mount(el, ctx) {
const K = kit(ctx);
const base = (ctx.config && ctx.config.ENGINE_URL) || V.ENGINE_URL;
const online = () => { try { return !!(ctx.video && typeof ctx.video.online === 'function' && ctx.video.online()); } catch { return false; } };
const _o4 = online();
const _o5 = detectOs(typeof navigator !== 'undefined' ? navigator : null) === 'mobile';
const _o0 = (path, opts = {}) => (online()
? Promise.reject(Object.assign(new Error('Đang chỉ dùng AI trên mạng – không dùng máy dựng trên máy này'), { code: 'ONLINE_MODE' }))
: _o5 ? Promise.reject(Object.assign(new Error('Điện thoại không dựng video – bấm "Gửi máy tính dựng" để máy tính của anh/chị dựng'), { code: 'PHONE' }))
: V.engineCall(path, { base, ...opts }));
const st = { health: null, jobs: [], watching: new Set(), poll: 0, cfgOk: null, preview: null, clips: [], music: null, plan: null };
const _o18 = (el.__bdsVideoGen = (el.__bdsVideoGen || 0) + 1);
const alive = () => el.isConnected && el.__bdsVideoGen === _o18;
let _o2d = null;
const channelName = () => {
let _o1y = {};
try { _o1y = (ctx.settings && typeof ctx.settings.get === 'function' && ctx.settings.get('profile', {})) || {}; } catch { _o1y = {}; }
const _o1f = (ctx.config && ctx.config.INSTANCE) || {};
return String(_o1f.CHANNEL || _o1y.company || _o1y.name || '').replace(/\s+/g, ' ').trim().slice(0, 60);
};
const _o24 = () => channelName() || 'BĐS';
el.innerHTML = '';
const _oy = h('div', { 'data-testid': 'engine-status' });
const jobsBody = h('div', { class: 'bds-list', 'data-testid': 'video-jobs' });
const queuedBody = h('div');
const flowOut = h('div', { 'data-testid': 'flow-plan' });
const clipList = h('div', { class: 'bds-list', 'data-testid': 'flow-clips' });
async function refreshHealth() {
if (st.pairEl && !_o5 && !online()) { await _oj(); if (st.pairEl) { _o2i(); return null; } }
try { st.health = await _o0('/health', { timeout: 2500 }); } catch { st.health = null; }
if (st.health) st.pairEl = null;
else if (!_o5 && !online()) await _oj();
_o2i();
return st.health;
}
async function _oj() {
let _o26 = null;
try { _o26 = await pairStatus(base); } catch { _o26 = null; }
if (!(_o26 && _o26.running && !_o26.trusted)) { st.pairEl = null; return; }
if (st.pairEl) return;
const ui = ctx.ui || {};
st.pairEl = ui.h && ui.button ? pairBox({ h: ui.h, button: ui.button, toast: ui.toast, icon: ui.icon }, base, { onPaired: async () => { st.pairEl = null; await refreshHealth(); if (st.health && alive()) { loopJobs(); if (_o2d) _o2d.rerender(); } } }) : null;
}
function _o2k() {
const _ow = engineDownload(null);
const _o7 = (_ot) => { try { return new URL(_ot.path, location.href).href; } catch { return _ot.path; } };
_oy.innerHTML = '';
_oy.appendChild(h('div', { 'data-testid': 'engine-phone' },
h('p', null, K.badge('Điện thoại', 'info'), ' Điện thoại không dựng video được – soạn và duyệt dàn cảnh ở đây, rồi chọn cách làm ở mục "Gửi video đi" bên dưới:'),
h('ul', { class: 'bds-note' },
h('li', null, h('b', null, 'Gửi máy tính dựng'), ' – miễn phí, máy tính Windows/Mac CỦA anh/chị (đã cài bộ tạo video) tự dựng khi bật.'),
h('li', null, h('b', null, 'Làm bằng AI trên mạng ngay'), ' – không cần máy tính, thu phí riêng theo nhà cung cấp, app hỏi trước mỗi lần.')),
h('div', { class: 'bds-row bds-wrap' },
K.button('Tới phần gửi video', () => _o2d && _o2d.focus(), { kind: 'primary', icon: 'send', testid: 'engine-phone-go' }),
K.button('Chép link bộ cài cho máy tính', async () => {
await K.copy('Bộ cài BDS Studio – máy dựng video\nWindows: ' + _o7(_ow.primary) + '\nMac: ' + _o7(_ow.other));
K.toast('Đã chép link – mở trên máy tính để tải bộ cài', 'success');
}, { icon: 'copy', testid: 'engine-phone-copy' }))));
}
function _o2i() {
if (_o5) { _o2k(); return; }
const _o19 = st.health; const _o2q = V.engineState(_o19);
_oy.innerHTML = '';
if (!_o19 && st.pairEl) {
_oy.append(h('div', { class: 'bds-row bds-wrap' }, K.badge('Máy dựng đang chạy – chưa ghép nối với app này', 'warn')), st.pairEl);
return;
}
_oy.appendChild(h('div', { class: 'bds-row bds-wrap' }, K.badge(_o2q.label, _o2q.tone),
_o19 ? h('span', { class: 'bds-muted' }, `Bản ${_o19.version} · ${_o19.os_family === 'mac' ? 'Mac' : _o19.os_family === 'windows' ? 'Windows' : _o19.os} · RAM ${_o19.ram_gb} GB · trống ${_o19.free_disk_gb} GB`) : null));
if (!_o19) {
const os = V.osFamily(typeof navigator !== 'undefined' ? navigator.userAgent : '');
const _o1a = typeof location !== 'undefined' && location.protocol === 'https:';
if (_o1a && os !== 'mobile') {
_oy.appendChild(h('div', { class: 'bds-row bds-wrap' },
K.button('Mở Video trên máy này', openLocal, { kind: 'primary', icon: 'monitor', testid: 'open-local' })));
_oy.appendChild(h('p', { class: 'bds-muted' },
'Đã cài máy dựng: bấm đúp biểu tượng "BDS Studio" (ngôi nhà vàng) trên màn hình nền – máy dựng chạy nền. Lần đầu Chrome hỏi "Truy cập mạng cục bộ" → bấm Cho phép (lỡ chặn: biểu tượng bên trái thanh địa chỉ → Cài đặt trang web → Truy cập mạng cục bộ → Cho phép). Safari thường chặn hẳn – khi đó dùng nút "Mở Video trên máy này".'));
}
_oy.appendChild(h('ol', { class: 'bds-note' },
(() => { const _ow = engineDownload(typeof navigator !== 'undefined' ? navigator : null); const _ou = (_ot, main) => { const a = K.linkBtn((main ? 'Tải bộ cài cho ' : 'Máy ' + _ot.label + '? Tải bộ cài cho ') + _ot.label, _ot.path, null, { kind: main ? 'primary' : 'ghost', icon: 'download', testid: main ? 'download-installer' : 'download-installer-other' }); a.setAttribute('download', _ot.file); return a; };
return h('li', null, 'Tải Bộ cài Máy dựng video (một lần – chỉ máy dựng video, không làm video thì không cần): ', h('div', { class: 'bds-row bds-wrap' }, _ou(_ow.primary, true), _ou(_ow.other, false))); })(),
h('li', null, os === 'windows' ? 'Giải nén, mở thư mục BDS_Studio_Engine, bấm đúp "Cai dat voi 1 click".' : 'Giải nén. Mở Terminal (⌘ + Space, gõ Terminal), gõ "bash " rồi kéo file "Cai dat voi 1 click.command" thả vào Terminal → Enter.'),
h('li', null, 'Sau đó mỗi lần dựng video: bấm đúp "BDS Studio" trên màn hình nền (Desktop).'),
_o1a ? h('li', null, 'Nếu trình duyệt chặn kết nối: mở app tại ', h('a', { href: base, target: '_blank', rel: 'noopener' }, base), ' trên máy tính.') : null));
_oy.appendChild(h('div', { class: 'bds-row bds-wrap' },
K.button('Thử kết nối lại', refreshHealth, { icon: 'refresh', testid: 'engine-retry' }),
K.button('Tự kiểm tra', () => _o1v(), { icon: 'pulse', testid: 'engine-selfcheck' })));
return;
}
const _o3f = _o19.video_pack || null;
const items = [
['Bộ công cụ dựng video', _o19.ffmpeg ? '✓ ' + _o19.ffmpeg : _o3f && !_o3f.wanted ? '○ chưa cài (tuỳ chọn)' : '✗ chưa có'],
['Giọng Vbee', _o19.vbee_configured ? '✓ đã cài khoá' : '✗ chưa cài khoá'],
['AI trên máy (Ollama)', _o19.ollama && _o19.ollama.running ? '✓ ' + (_o19.ollama.models.join(', ') || 'chưa có mô hình') : '— chưa chạy (không bắt buộc)'],
['Video lưu ở', _o19.video_dir || '~/BDS Studio/Video'],
];
_oy.appendChild(h('dl', { class: 'bds-dl' }, items.map(([_o1k, _o3e]) => [h('dt', null, _o1k), h('dd', null, _o3e)])));
if (_o3f && !_o3f.installed && !_o19.ffmpeg) _oy.appendChild(_o1z(_o3f));
if (_o19.busy) _oy.appendChild(h('p', { class: 'bds-muted' }, `Đang dựng – còn khoảng ${V.fmtEta(_o19.eta_s)}. AI trên máy tạm nghỉ để đủ RAM.`));
_oy.appendChild(h('div', { class: 'bds-row bds-wrap' },
K.button('Tự kiểm tra', () => _o1v(), { icon: 'pulse', testid: 'engine-selfcheck' }),
K.button('Khoá Vbee', openSecrets, { icon: 'key', testid: 'engine-secrets' }),
K.button('Chuyển máy', openMigrate, { icon: 'monitor', testid: 'engine-migrate' }),
K.linkBtn('Studio dựng chi tiết', base + '/studio', null, { target: '_blank', icon: 'external', testid: 'engine-studio' })));
}
function _o1z(_o3f) {
const _of = h('div', { class: 'bds-note', 'data-testid': 'video-pack-missing' },
h('p', null, h('b', null, 'Chưa cài Bộ công cụ dựng video'), _o3f.wanted ? '' : ' (tuỳ chọn)'),
h('p', { class: 'bds-muted' }, 'Dựng video bản đồ/quy hoạch ngay trên máy cần Bộ công cụ dựng video. Hoặc dùng Video AI trên mạng – thu phí riêng, tuỳ mô hình/nhà cung cấp.'),
_o3f.weak ? h('p', { class: 'bds-warn', 'data-testid': 'video-pack-weak' }, '⚠ ' + (_o3f.warning || 'Máy yếu: video dựng trên máy sẽ không đẹp và giật – chỉ nên dùng để làm video mẫu.')) : null);
const _o23 = h('div', { 'data-testid': 'video-pack-progress' });
_of.appendChild(h('div', { class: 'bds-row bds-wrap' },
K.button('Cài ngay', () => _o1g(_o3f, _o23), { kind: 'primary', icon: 'download', testid: 'video-pack-install' }),
K.button('Dùng Video AI trên mạng (thu phí riêng)', () => {
let on = true; try { on = !ctx.packs || ctx.packs.moduleOn('videoai_taocanh'); } catch { on = true; }
K.nav(on ? 'content/videoai_taocanh' : 'settings/packs');
}, { icon: 'cloud', testid: 'video-pack-online' })));
_of.appendChild(_o23);
return _of;
}
async function _o1g(_o3f, _o23) {
if (_o3f.weak) {
const ok = await K.confirm({ title: 'Cài Bộ công cụ dựng video', testid: 'video-pack-confirm', ok: 'Vẫn cài',
text: (_o3f.warning || 'Máy yếu: video dựng trên máy sẽ không đẹp và giật – chỉ nên dùng để làm video mẫu.') + ' Vẫn cài Bộ công cụ dựng video (Windows tải ~100–200 MB, Mac ~80 MB)?' });
if (!ok) return;
}
try { await _o0('/selfcheck/fix', { method: 'POST', body: { video_pack: true } }); } catch (e) { K.toast(e.message, 'warn'); return; }
const bar = h('progress', { max: 1, value: 0 });
const line = h('p', { class: 'bds-muted', 'data-testid': 'video-pack-status' }, 'Đang cài Bộ công cụ dựng video…');
const log = h('pre', { class: 'bds-pre bds-scroll' }, '');
_o23.innerHTML = ''; _o23.appendChild(h('div', null, line, bar, log));
for (let _o1b = 0; _o1b < 1200 && alive(); _o1b++) {
await new Promise((r) => setTimeout(r, 1500));
let _o2q; try { _o2q = await _o0('/selfcheck/fix'); } catch { continue; }
bar.value = _o2q.download !== undefined && _o2q.progress < 1 ? _o2q.download : (_o2q.progress || 0);
log.textContent = _o2q.log || '';
if (_o2q.state === 'done' || _o2q.state === 'error') {
const ok = _o2q.state === 'done' && !(_o2q.remaining || []).some((_o1r) => /ffmpeg|ffprobe/.test(_o1r));
line.textContent = ok ? '✓ Đã cài Bộ công cụ dựng video.' : '✗ Chưa cài xong – xem nhật ký, bấm Cài ngay để thử lại.';
K.toast(ok ? 'Đã cài Bộ công cụ dựng video' : 'Chưa cài xong Bộ công cụ dựng video', ok ? 'success' : 'warn');
if (ok) refreshHealth();
return;
}
}
}
async function openLocal() {
const LOCAL = 'http://127.0.0.1:8765/#/content/video';
const _o3h = window.open('', '_blank');
let ok = false;
try { const _o19 = await _o0('/health', { timeout: 2500 }); ok = !!(_o19 && _o19.app === 'bds-studio-engine'); } catch { ok = false; }
if (ok) { if (_o3h) _o3h.location.href = LOCAL; else location.href = LOCAL; return; }
if (_o3h) _o3h.close();
const _o1o = K.modal({ title: 'Chưa kết nối được máy dựng', testid: 'engine-off-modal', body: h('div', null,
h('p', null, 'Có 2 khả năng:'),
h('ol', { class: 'bds-note' },
h('li', null, h('b', null, 'Máy dựng chưa bật: '), 'bấm đúp biểu tượng "BDS Studio" (ngôi nhà vàng) trên màn hình nền.'),
h('li', null, h('b', null, 'Chrome chưa cho phép: '), 'Chrome hỏi "Truy cập mạng cục bộ / Local network access" thì bấm ', h('b', null, 'Cho phép'),
'. Lỡ chặn rồi: bấm biểu tượng bên trái thanh địa chỉ → ', h('b', null, 'Cài đặt trang web'), ' → ', h('b', null, 'Truy cập mạng cục bộ'), ' → ', h('b', null, 'Cho phép'), ' → tải lại trang.')),
h('div', { class: 'bds-row bds-wrap' },
K.button('Thử lại', () => { _o1o && _o1o.close && _o1o.close(); openLocal(); }, { kind: 'primary', icon: 'refresh' }),
K.linkBtn('Mở bản trên máy', LOCAL, null, { target: '_blank', icon: 'external', testid: 'open-local-direct' }),
K.button('Đóng', () => _o1o && _o1o.close && _o1o.close()))) });
}
async function _o1v() {
const _of = h('div', null, h('p', { class: 'bds-muted' }, 'Đang kiểm tra…'));
const _o1o = K.modal({ title: 'Tự kiểm tra máy dựng', body: _of, testid: 'selfcheck-modal', wide: true });
let _o2o;
try { _o2o = await _o0('/selfcheck', { timeout: 15000 }); } catch {
_of.innerHTML = '';
_of.appendChild(h('div', null,
h('p', null, '✗ Không kết nối được máy dựng ở ' + base + '.'),
h('ol', { class: 'bds-note' },
h('li', null, 'Mở "BDS Studio" trên màn hình nền (hoặc chạy start_mac.command / start_windows.bat).'),
h('li', null, 'Chưa cài thì bấm "Tải bộ cài" và làm theo HUONG_DAN_CAI.'),
h('li', null, 'Safari/Chrome chặn kết nối từ trang https: mở http://127.0.0.1:8765 trên chính máy đó.')),
K.button('Đóng', () => _o1o.close())));
return;
}
const _ov = r => {
_of.innerHTML = '';
_of.appendChild(h('div', { class: 'bds-list' }, r.items.map(_o1b => h('div', { class: 'bds-item', style: _o2 },
h('div', { class: 'bds-row-main' }, h('strong', null, (_o1b.ok ? '✓ ' : _o1b.required ? '✗ ' : '○ ') + _o1b.name), h('span', { class: 'bds-sub' }, _o1b.detail || '')),
!_o1b.ok && _o1b.fix ? h('small', { class: 'bds-muted' }, _o1b.fix) : null))));
const auto = r.items.some(_o1b => _o1b.auto);
_of.appendChild(h('div', { class: 'bds-row bds-end' },
auto ? K.button('Tự sửa phần thiếu', runFix, { kind: 'primary', icon: 'wrench', testid: 'selfcheck-fix' }) : null,
K.button('Đóng', () => _o1o.close())));
};
const runFix = async () => {
try { await _o0('/selfcheck/fix', { method: 'POST', body: {} }); } catch (e) { K.toast(e.message, 'warn'); return; }
const log = h('pre', { class: 'bds-pre bds-scroll' }, '');
const bar = h('progress', { max: 1, value: 0 });
_of.appendChild(h('div', null, bar, log));
for (let _o1b = 0; _o1b < 1200 && alive(); _o1b++) {
await new Promise(r => setTimeout(r, 1500));
let _o2q; try { _o2q = await _o0('/selfcheck/fix'); } catch { continue; }
bar.value = _o2q.progress || 0; log.textContent = _o2q.log || '';
if (_o2q.state === 'done' || _o2q.state === 'error') {
K.toast(_o2q.state === 'done' ? 'Đã tự sửa xong' : 'Tự sửa chưa xong, xem nhật ký', _o2q.state === 'done' ? 'success' : 'warn');
try { _ov(await _o0('/selfcheck', { timeout: 15000 })); _of.appendChild(h('pre', { class: 'bds-pre' }, _o2q.log || '')); } catch { }
refreshHealth(); return;
}
}
};
_ov(_o2o);
}
function openSecrets() {
const app = h('input', { type: 'text', autocomplete: 'off', placeholder: 'App-Id', 'data-testid': 'vbee-app' });
const _o39 = h('input', { type: 'password', autocomplete: 'off', placeholder: 'Token', 'data-testid': 'vbee-token' });
const _o1o = K.modal({ title: 'Khoá giọng đọc Vbee', testid: 'secrets-modal', body: h('div', { class: 'bds-form' },
h('p', { class: 'bds-muted' }, 'Khoá lưu trong Keychain/Credential Manager của máy tính, không lưu trong app hay thư mục cài đặt. Để trống ô nào thì giữ nguyên ô đó.'),
K.field('App-Id', app), K.field('Token', _o39),
h('div', { class: 'bds-row bds-end' }, K.button('Huỷ', () => _o1o.close()), K.button('Lưu', async () => {
const body = {};
if (app.value.trim()) body.VBEE_APP_ID = app.value.trim();
if (_o39.value.trim()) body.VBEE_TOKEN = _o39.value.trim();
if (!Object.keys(body).length) { _o1o.close(); return; }
try { const r = await _o0('/secrets', { method: 'POST', body }); _o39.value = ''; _o1o.close();
K.toast(r.stored === 'keychain' ? 'Đã lưu khoá vào Keychain' : 'Đã lưu khoá (tệp riêng của máy)', 'success'); refreshHealth();
} catch (e) { K.toast(e.message, 'warn'); }
}, { kind: 'primary', testid: 'vbee-save' }))) });
}
function openMigrate() {
const _o27 = h('input', { type: 'password', autocomplete: 'new-password', placeholder: 'Mật khẩu gói (nên đặt)' });
const file = h('input', { type: 'file', accept: '.zip,application/zip' });
const _o28 = h('input', { type: 'password', autocomplete: 'off', placeholder: 'Mật khẩu gói (nếu có)' });
const _o1o = K.modal({ title: 'Chuyển máy', testid: 'migrate-modal', body: h('div', { class: 'bds-form' },
h('p', { class: 'bds-muted' }, 'Bước 1 (máy cũ): tạo gói cấu hình + dự án. Bước 2: cài máy dựng trên máy mới. Bước 3 (máy mới): nhận gói. Khoá Vbee không đi theo gói – nhập lại trên máy mới.'),
K.field('Mật khẩu', _o27),
K.button('1. Tạo gói chuyển máy', async () => {
try {
const r = await _o0('/migrate/export', { method: 'POST', body: { password: _o27.value || null }, raw: true, timeout: 120000 });
if (!r.ok) throw new Error('Không tạo được gói');
const blob = await r.blob(); const url = URL.createObjectURL(blob);
const name = ((r.headers.get('Content-Disposition') || '').match(/filename="([^"]+)"/) || [])[1] || 'bds_studio_chuyen_may.zip';
const a = h('a', { href: url, download: name }); document.body.appendChild(a); a.click(); a.remove();
setTimeout(() => URL.revokeObjectURL(url), 30000);
K.toast(r.headers.get('X-Encryption') === 'aes' ? 'Đã tạo gói có mật khẩu (AES)' : 'Đã tạo gói (không mật khẩu, không chứa khoá)', 'success');
} catch (e) { K.toast(e.message, 'warn'); }
}, { kind: 'primary', icon: 'disk', testid: 'migrate-export' }),
h('hr'), K.field('Gói từ máy cũ (.zip)', file), K.field('Mật khẩu', _o28),
K.button('3. Nhận từ máy cũ', async () => {
const _o11 = file.files && file.files[0]; if (!_o11) { K.toast('Chọn tệp .zip', 'warn'); return; }
try {
const r = await _o0('/migrate/import' + (_o28.value ? '?password=' + encodeURIComponent(_o28.value) : ''), { method: 'POST', body: _o11, timeout: 300000, headers: { 'Content-Type': 'application/zip' } });
K.toast(`Đã nhận ${r.imported.length} dự án` + (r.skipped_existing.length ? `, giữ nguyên ${r.skipped_existing.length} dự án đã có` : ''), 'success'); _o1o.close();
} catch (e) { K.toast(e.message, 'warn'); }
}, { icon: 'download', testid: 'migrate-import' })) });
}
async function _o33(_o1i, input) {
const status = _o1i.state === 'running' || _o1i.state === 'queued' ? _o1i.state : _o1i.state === 'done' ? 'done' : 'error';
try {
const _o1u = await K.get('jobs', _o1i.id);
await K.put('jobs', { ...(_o1u || {}), id: _o1i.id, type: _o1i.type, title: _o1i.title, status,
input: _o1u && _o1u.input ? _o1u.input : JSON.stringify(input || {}), output: JSON.stringify({ outputs: _o1i.outputs || {}, warnings: _o1i.warnings || [], error: _o1i.error || null }),
cost_estimate: _o1u ? _o1u.cost_estimate : 0 });
} catch { }
}
async function _o31(spec, input) {
const r = await _o0('/jobs', { method: 'POST', body: spec, timeout: 20000 });
const _o1i = { id: r.id, type: spec.type, title: spec.title || spec.name || spec.type, state: r.state, outputs: {} };
await _o33(_o1i, input || { mode: spec.mode });
st.watching.add(r.id);
loopJobs();
return r.id;
}
async function _o3i(id) {
for (;;) {
if (!alive()) return null;
await new Promise(r => setTimeout(r, 1500));
let _o1i; try { _o1i = await _o0('/jobs/' + id); } catch { continue; }
if (_o1i.state === 'done' || _o1i.state === 'error') { await _o33(_o1i); return _o1i; }
}
}
async function loopJobs() {
clearTimeout(st.poll);
if (!alive()) return;
try {
const r = await _o0('/jobs', { timeout: 4000 });
st.jobs = r.jobs || [];
_o2j();
if (r.busy) { st.poll = setTimeout(loopJobs, 2000); return; }
} catch { st.jobs = []; _o2j(); }
}
const _o13 = (id, key) => base + '/files/' + encodeURIComponent(id) + '/' + encodeURIComponent(key);
function _o21(id, key, title) {
K.modal({ title: title || 'Xem video', wide: true, testid: 'video-player', body: h('div', null,
h('video', { src: _o13(id, key), controls: true, playsinline: true, style: { width: '100%', maxHeight: '70vh', background: '#000', borderRadius: '10px' } }),
h('p', { class: 'bds-muted' }, V.AI_LABEL_REMINDER)) });
}
function _o2j() {
jobsBody.innerHTML = '';
if (!st.jobs.length) { jobsBody.appendChild(K.empty(st.health ? 'Chưa có job dựng nào.' : 'Bật máy dựng để xem danh sách job.')); return; }
for (const _o1i of st.jobs.slice(0, 20)) {
const tone = { done: 'success', error: 'danger', running: 'info', queued: 'muted' }[_o1i.state] || 'muted';
const _o1x = _o1i.outputs || {};
jobsBody.appendChild(h('div', { class: 'bds-item', style: _o2, 'data-testid': 'job-' + _o1i.id },
h('div', { class: 'bds-row-main' }, h('strong', null, _o1i.title || _o1i.type),
h('span', { class: 'bds-sub' }, (_o1i.type === 'video_flow' ? 'Nhân vật đi trong căn' : 'Bản đồ · ' + (_o1i.mode || '')))),
h('div', { class: 'bds-row bds-wrap' }, K.badge(V.jobLabel(_o1i.state), tone),
_o1i.state === 'running' || _o1i.state === 'queued' ? h('progress', { max: 1, value: _o1i.progress || 0, style: { flex: '1', minWidth: '120px' } }) : null),
_o1x.mp4 ? h('div', { class: 'bds-row bds-wrap' },
K.button('Xem', () => _o21(_o1i.id, 'mp4', _o1i.title), { kind: 'primary', icon: 'film' }),
K.linkBtn('Tải MP4', _o13(_o1i.id, 'mp4'), null, { target: '_blank', icon: 'download' }),
_o1x.srt ? K.linkBtn('Phụ đề .srt', _o13(_o1i.id, 'srt'), null, { target: '_blank', icon: 'download' }) : null,
_o1x.cover ? K.linkBtn('Ảnh bìa', _o13(_o1i.id, 'cover'), null, { target: '_blank', icon: 'download' }) : null) : null,
_o1x.gif ? K.linkBtn('Tải GIF', _o13(_o1i.id, 'gif'), null, { target: '_blank', icon: 'download' }) : null,
_o1x.contact ? h('img', { src: _o13(_o1i.id, 'contact'), alt: 'Ảnh nháp các cảnh', loading: 'lazy', style: { maxWidth: 'min(100%, 480px)', borderRadius: '8px' } }) : null,
(_o1i.warnings || []).length ? h('small', { class: 'bds-muted' }, '⚠ ' + _o1i.warnings.slice(0, 3).join(' · ')) : null,
_o1i.state === 'error' ? h('details', null, h('summary', null, _o1i.error || 'Xem nhật ký lỗi'), h('pre', { class: 'bds-pre bds-scroll' }, (_o1i.log || '').slice(-3000))) : null));
}
}
async function _o2m() {
queuedBody.innerHTML = '';
const rows = (await K.list('jobs')).filter(r => r.status === 'queued' && String(r.type || '').startsWith('video') && r.type !== 'video_remote' && r.type !== 'video_ai_online' && !st.jobs.some(_o1i => _o1i.id === r.id));
if (!rows.length) return;
queuedBody.appendChild(h('p', { class: 'bds-muted' }, 'Việc video đã duyệt, chờ làm:'));
for (const r of rows) {
const _o1e = V.parseData(r.input);
queuedBody.appendChild(h('div', { class: 'bds-item', style: _o2, 'data-testid': 'queued-' + r.id },
h('div', { class: 'bds-row-main' }, h('strong', null, r.title || 'Video'), h('span', { class: 'bds-sub' }, _o1e.url || _o1e.topic || '')),
K.button('Làm', () => { topic.value = [_o1e.title || r.title, _o1e.url].filter(Boolean).join('\n'); topic.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, { kind: 'primary', icon: 'content' })));
}
}
const _o1q = _o30(LS_MAP) || {};
const topic = h('textarea', { rows: 3, placeholder: 'Dán link bài báo hoặc gõ chủ đề (vd: cầu Trần Hưng Đạo khởi công)…', 'data-testid': 'map-topic', value: _o1q.topic || '' });
const cfgTa = h('textarea', { rows: 8, spellcheck: false, placeholder: 'cfg.json – máy dựng tự tạo sau khi Duyệt dàn cảnh (hoặc dán tay)', 'data-testid': 'map-cfg', value: _o1q.cfg || '', style: { fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '13px' } });
const voiceMap = h('input', { type: 'checkbox', checked: true, 'data-testid': 'map-voice' });
const autoSave = h('input', { type: 'checkbox', checked: _o1q.autosave !== false, 'data-testid': 'map-autosave' });
const cfgMsg = h('div', { 'data-testid': 'map-validate' });
const previewBox = h('div', { 'data-testid': 'map-preview' });
const scriptBox = h('div', { 'data-testid': 'script-box' });
const approvedBox = h('div', { 'data-testid': 'script-approved' });
const _oh = h('div', { 'data-testid': 'caption-box' });
const driveBox = h('div', { 'data-testid': 'drive-status', 'aria-live': 'polite' });
const _o1m = () => _o30(LS_MAP, { topic: topic.value, cfg: cfgTa.value, script_id: st.scriptId || null, autosave: autoSave.checked });
topic.addEventListener('input', _o1m); cfgTa.addEventListener('input', () => { st.cfgOk = null; _o1m(); }); autoSave.addEventListener('change', _o1m);
const _o22 = (() => { try { return sessionStorage.getItem('bds.video.prefill'); } catch { return null; } })();
if (_o22) { topic.value = _o22; try { sessionStorage.removeItem('bds.video.prefill'); } catch { } }
const _ok = !!(await K.setting('ai.claude_api_enabled', false));
const _ob = h('select', { 'data-testid': 'script-ai', 'aria-label': 'AI soạn' }, VS.SCRIPT_AI.filter(a => !(_o4 && a.id === 'ollama')).map(a => h('option', { value: a.id, disabled: a.id === 'claude_api' && !_ok },
a.label + (a.id === 'claude_api' && !_ok ? ' (đang tắt – bật ở Cài đặt › Bộ chọn AI)' : ''))));
_ob.value = VS.pickAi((() => { try { return localStorage.getItem(VS.LS_AI); } catch { return null; } })(), { claudeEnabled: _ok });
if (_o4 && (!_ob.value || _ob.value === 'ollama')) _ob.value = VS.DEFAULT_AI;
const aiHint = h('small', { class: 'bds-muted', 'data-testid': 'script-ai-hint' });
const _o2x = () => {
aiHint.textContent = {
gemini: 'Gemini tìm Google để kiểm số liệu, miễn phí trong hạn mức của Google. Khâu kiểm số kém Claude – soát kỹ cột Nguồn.',
claude_api: 'Claude tìm web + kiểm số tốt nhất; có phí theo lượt, app báo giá trước mỗi lần và tính vào ngân sách AI tháng.',
ollama: 'AI trên Mac: miễn phí, dữ liệu không ra ngoài, nhưng KHÔNG tìm web → mọi số liệu phải tự mở nguồn kiểm.',
handoff: 'App chép sẵn lời nhắn → mở Claude/Gemini trên web (gói anh/chị đang có, 0 đồng) → dán câu trả lời về.',
}[_ob.value] || '';
};
const _oa = () => typeof document !== 'undefined' && document.documentElement.dataset.ai === 'off';
if (_oa() && _ob.value !== 'handoff') _ob.value = 'handoff';
const _o3k = K.button('Soạn kịch bản', () => _o3m(), { kind: 'primary', icon: 'sparkle', testid: 'script-write' });
const _o9 = (id) => ({ id, provider: _ob.value === 'handoff' ? 'handoff' : _ob.value });
const _o35 = (b, feat = 'video_script') => {
if (!b) return b; if (_ob.value === 'handoff') delete b.dataset.ai; else b.dataset.ai = 'auto';
b.querySelectorAll('.ai-badge').forEach(_o3n => _o3n.remove()); b.appendChild(K.aiBadge(_o9(feat))); return b;
};
_ob.addEventListener('change', () => { try { localStorage.setItem(VS.LS_AI, _ob.value); } catch { } _o2x(); _o35(_o3k); _o2e(); });
_o2x(); _o35(_o3k);
st.scriptId = _o1q.script_id || null;
st.rec = null;
async function _o1n() {
if (!st.scriptId) return;
const _o2p = await K.get('jobs', st.scriptId);
if (_o2p && !Number(_o2p.deleted)) { st.rec = V.parseData(_o2p.input); st.recOut = V.parseData(_o2p.output); }
}
async function _o2r() {
if (!st.rec) return;
if (!st.scriptId) { st.scriptId = 'vs' + K.newId(); _o1m(); }
const _or = _os();
const _op = (st.rec.versions || []).reduce((a, _o3e) => a + (Number(_o3e.cost_usd) || 0), 0) + (Number(st.rec.captions && st.rec.captions.cost_usd) || 0);
try {
await K.put('jobs', { id: st.scriptId, type: VS.SCRIPT_TYPE, title: (_or && _or.outline.title) || topic.value.split('\n')[0].slice(0, 100) || 'Kịch bản video',
status: st.rec.approved ? 'approved' : 'draft', input: JSON.stringify(VS.fitCell(st.rec)), output: JSON.stringify(st.recOut || {}), cost_estimate: Math.round(_op * 10000) / 10000 });
} catch { }
}
const _os = () => (st.rec && st.rec.versions && st.rec.versions[st.rec.current ?? st.rec.versions.length - 1]) || null;
async function _on(prompt, kind) {
let est;
try { est = (await K.api('video.ai_script', { provider: 'claude_api', prompt, kind, estimate_only: true })).estimate; }
catch (e) { K.toast(e.message || 'Không lấy được giá Claude', 'warn'); return false; }
if (!est.enabled) { K.toast('Claude API chưa bật hoặc chưa có khoá – bật ở Cài đặt › Bộ chọn AI, dán khoá ở Cài đặt › Kết nối (nhân viên: nhờ Quản trị).', 'warn'); return false; }
const b = est.budget;
const text = `Ước tính lần ${kind === 'caption' ? 'soạn caption' : 'soạn dàn cảnh'} này: ≈ ${VS.fmtUsd(est.usd)} (tối đa ~${VS.fmtUsd(est.usd_max)}), ` +
`${est.model}, ~${est.tokens_in.toLocaleString('vi-VN')} token vào / ~${est.tokens_out.toLocaleString('vi-VN')} token ra` + (est.searches ? `, tối đa ${est.searches} lượt tìm web (0,01 USD/lượt)` : '') + '.' +
(b ? ` Ngân sách AI tháng còn ${VS.fmtUsd(b.left_usd)} / ${VS.fmtUsd(b.cap_usd)}.` : ' Tính vào ngân sách AI tháng của app.');
return K.aiConfirm({ id: kind === 'caption' ? 'video_caption' : 'video_script', provider: 'claude_api' },
{ est: { usd: est.usd, text, model: '' }, title: 'Claude API – báo giá trước', testid: 'claude-cost' });
}
async function _oo(prompt, kind) {
let est = { free: true, usd: 0 };
if (!K.aiEnv().geminiFree) { try { est = (await K.api('video.ai_script', { provider: 'gemini', prompt, kind, estimate_only: true })).estimate || null; } catch { est = null; } }
return K.aiConfirm({ id: kind === 'caption' ? 'video_caption' : 'video_script', provider: 'gemini' }, { est, testid: 'gemini-cost' });
}
async function _og(ai, prompt, kind) {
if (ai === 'gemini' || ai === 'claude_api') {
if (ai === 'claude_api' && !(await _on(prompt, kind))) return null;
if (ai === 'gemini' && !(await _oo(prompt, kind))) return null;
const r = await K.api('video.ai_script', { provider: ai, prompt, kind });
return { text: r.text, ai, model: r.model, cost_usd: r.cost_usd || 0, evidence: { sources: r.sources, segments: r.segments, queries: r.queries, citations: r.citations } };
}
if (ai === 'ollama') {
if (!ctx.ai || !ctx.ai.run) throw new Error('Chưa bật AI trợ lý');
const r = await ctx.ai.run('script', { prompt, json: true, provider: 'ollama', feature: 'video_script' });
const _o3d = r && r.provider === 'ollama' ? 'ollama' : 'gemini';
return { text: (r && r.text) || '', ai: _o3d, model: _o3d === 'ollama' ? 'Ollama' : (r && r.model) || '', cost_usd: Number(r && r.cost_usd) || 0, evidence: {} };
}
if (!ctx.ai || !ctx.ai.handoff) { await K.copy(prompt); window.open('https://claude.ai/new', '_blank', 'noopener'); K.toast('Đã chép lời nhắn – dán vào Claude, rồi dán câu trả lời vào ô cfg.json', 'info'); return null; }
const text = await ctx.ai.handoff('script', prompt, { target: 'claude' });
return text ? { text, ai: 'handoff', model: 'chat', cost_usd: 0, evidence: {} } : null;
}
async function _o3m(ai = _ob.value) {
if (!topic.value.trim()) { K.toast('Dán link bài báo hoặc gõ chủ đề trước', 'warn'); topic.focus(); return; }
scriptBox.prepend(h('p', { class: 'bds-muted', 'data-testid': 'script-busy' }, `Đang soạn bằng ${VS.aiInfo(ai).short}… (Gemini/Claude có tìm web nên mất 20–60 giây)`));
let r;
try { r = await _og(ai, VS.buildScriptPrompt(topic.value, { today: new Date().toISOString().slice(0, 10), channel: _o24() }), 'script'); }
catch (e) { if (!K.isAiCancel(e)) K.toast(e.code === 'QUOTA' ? e.message : 'AI chưa soạn được: ' + (e.message || ''), 'warn'); _o2n(); return; }
if (!r) { _o2n(); return; }
const outline = VS.parseOutline(r.text);
if (!outline) {
_o2n();
scriptBox.prepend(h('div', { class: 'bds-error', 'data-testid': 'script-parse-error' }, '✗ AI trả lời không đúng dạng dàn cảnh – bấm Soạn lại hoặc chọn AI khác.',
h('details', null, h('summary', null, 'Xem câu trả lời'), h('pre', { class: 'bds-pre bds-scroll' }, String(r.text || '').slice(0, 4000)))));
return;
}
st.rec = VS.addVersion({ ...(st.rec || {}), topic: topic.value.slice(0, 2000), approved: null }, { ...r, outline, at: Date.now() });
st.recOut = { ...(st.recOut || {}), cfg: null };
approvedBox.innerHTML = '';
await _o2r();
_o2n();
K.toast(`Đã soạn dàn cảnh bằng ${VS.aiLabel(r.ai)} – soát rồi bấm Duyệt`, 'success');
}
function rewriteOther() {
const _or = _os();
const opts = VS.SCRIPT_AI.filter(a => !(_or && a.id === _or.ai) && !(a.id === 'claude_api' && !_ok) && (!_oa() || a.id === 'handoff'));
const _o1o = K.modal({ title: 'Soạn lại bằng AI khác để so sánh', testid: 'rewrite-modal', body: h('div', { class: 'bds-list' },
opts.map(a => K.button(a.label, () => { _o1o.close(); _o3m(a.id); }, { icon: 'sparkle', testid: 'rewrite-' + a.id })),
h('p', { class: 'bds-muted' }, 'Bản cũ vẫn giữ – app hiện bảng so sánh 2 bản để anh/chị chọn bản tốt hơn.')) });
}
const _o16 = ms => { try { return new Date(ms).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }); } catch { return ''; } };
const _o6 = {
missing: ['⚠ chưa có nguồn', 'danger'], unverified: ['⚠ mở link kiểm', 'warn'], grounded: ['✓ khớp kết quả tìm kiếm', 'success'], checked: ['✓ đã tự kiểm', 'success'],
};
let _o12 = []; let _o2v = [];
function _o2c() {
const _o3e = _os(); if (!_o3e) return null;
const c = VS.checkOutline(_o3e.outline, _o3e.evidence);
for (const _o11 of c.figures) {
const b = _o12[_o11.scene] && _o12[_o11.scene][_o11.fig];
if (b) { const [t, tone] = _o6[_o11.status]; b.textContent = t; b.className = 'bds-badge bds-tone-' + tone; b.dataset.status = _o11.status; }
}
_o2v.forEach((el, _o1b) => {
el.innerHTML = '';
for (const _o1h of c.issues.filter(_o3n => _o3n.scene === _o1b && _o3n.fig === undefined)) {
el.appendChild(h('div', { class: _o1h.level === 'block' ? 'bds-error' : 'bds-muted', 'data-testid': `issue-${_o1b}-${_o1h.code}` }, (_o1h.level === 'block' ? '✗ ' : '⚠ ') + _o1h.message,
_o1h.code === 'number_unsourced' ? K.button('+ Thêm vào số liệu', () => { _o3e.outline.scenes[_o1b].figures.push({ label: '', value: _o1h.value, month: '', source_url: '' }); _ox(true); }, { testid: `add-fig-from-${_o1b}` }) : null));
}
});
summary.innerHTML = '';
const _o1r = c.counts;
summary.appendChild(h('p', null, K.badge(`${_o1r.ok}/${_o1r.figures} số liệu đã khớp nguồn`, _o1r.missing ? 'danger' : _o1r.unverified ? 'warn' : 'success'), ' ',
_o1r.missing ? K.badge(`${_o1r.missing} số thiếu nguồn`, 'danger') : null, ' ', _o1r.unverified ? K.badge(`${_o1r.unverified} số cần tự mở kiểm`, 'warn') : null,
h('span', { class: 'bds-muted' }, ` · ${_o3e.outline.scenes.length} cảnh · lời đọc ~${_o1r.seconds} giây`)));
for (const _o1h of c.issues.filter(_o3n => _o3n.scene === undefined)) summary.appendChild(h('p', { class: _o1h.level === 'block' ? 'bds-error' : 'bds-muted' }, (_o1h.level === 'block' ? '✗ ' : '⚠ ') + _o1h.message));
approveBtn.disabled = !c.ok;
_oe.textContent = c.ok ? (_o1r.unverified ? `Còn ${_o1r.unverified} số do AI ghi nguồn chưa khớp kết quả tìm kiếm – mở link kiểm rồi tick "Đã kiểm".` : 'Đủ nguồn – bấm Duyệt để máy dựng tạo cfg.json.')
: `Chưa duyệt được: ${_o1r.block} lỗi đỏ (số thiếu nguồn / từ cấm / "đã phê duyệt" thiếu số văn bản).`;
return c;
}
let _o2s = 0;
function _ox(structural) {
if (st.rec) st.rec.approved = null;
if (_o2d) _o2d.rerender();
clearTimeout(_o2s); _o2s = setTimeout(_o2r, 600);
if (structural) _o2n(); else _o2c();
}
const summary = h('div', { 'data-testid': 'script-summary' });
const approveBtn = K.button(_o4 ? 'Duyệt dàn cảnh' : 'Duyệt dàn cảnh → tạo cfg', () => _oc(), { kind: 'primary', icon: 'check', testid: 'script-approve' });
const _oe = h('small', { class: 'bds-muted', 'data-testid': 'script-block-why' });
function _o2u(_o3e, sc, _o1b) {
const _o1r = _o3e.outline.scenes.length;
const kind = K.select(Object.entries(VS.SCENE_KINDS), sc.kind, { 'data-testid': `sc-kind-${_o1b}`, 'aria-label': 'Loại cảnh' });
kind.addEventListener('change', () => { sc.kind = kind.value; _ox(true); });
const title = h('input', { type: 'text', value: sc.title, 'data-testid': `sc-title-${_o1b}`, 'aria-label': 'Chữ trên hình' });
title.addEventListener('change', () => { sc.title = title.value.trim(); _ox(); });
const _o1s = h('textarea', { rows: Math.min(6, Math.max(2, sc.narration.length)), 'data-testid': `sc-narr-${_o1b}`, value: sc.narration.map(l => l.text).join('\n') });
_o1s.addEventListener('change', () => {
const _o1u = new Map(sc.narration.map(l => [l.text, l.say]));
sc.narration = _o1s.value.split('\n').map(_o2q => _o2q.trim()).filter(Boolean).map(t => (_o1u.get(t) ? { text: t, say: _o1u.get(t) } : { text: t }));
_ox();
});
const places = h('textarea', { rows: 2, 'data-testid': `sc-places-${_o1b}`, value: (sc.places || []).join('\n'), placeholder: 'Mỗi dòng 1 địa điểm, vd: Cầu Vĩnh Tuy, Hà Nội' });
places.addEventListener('change', () => { sc.places = places.value.split('\n').map(_o2q => _o2q.trim()).filter(Boolean).slice(0, 4); _ox(); });
_o12[_o1b] = [];
const figs = h('div', { class: 'bds-list' }, (sc.figures || []).map((_o11, _o1k) => {
const _o1e = (key, ph, _o3h) => { const _o3n = h('input', { type: key === 'source_url' ? 'url' : 'text', value: _o11[key] || '', placeholder: ph, 'data-testid': `fig-${key}-${_o1b}-${_o1k}`, 'aria-label': ph, style: { minWidth: _o3h } });
_o3n.addEventListener('change', () => { _o11[key] = _o3n.value.trim(); if (key === 'source_url' || key === 'value') _o11.checked = false; _ox(); }); return _o3n; };
const badge = h('span', { class: 'bds-badge', 'data-testid': `fig-status-${_o1b}-${_o1k}` });
_o12[_o1b][_o1k] = badge;
const chk = h('input', { type: 'checkbox', checked: !!_o11.checked, 'data-testid': `fig-checked-${_o1b}-${_o1k}` });
chk.addEventListener('change', () => { _o11.checked = chk.checked; _ox(); });
return h('div', { class: 'bds-item', style: _o2, 'data-testid': `fig-${_o1b}-${_o1k}` },
h('div', { style: _o1 }, _o1e('label', 'Nhãn (vd Tổng vốn)', '0'), _o1e('value', 'Số (vd 4,8 km)', '0'), _o1e('month', 'Tháng số liệu', '0')),
_o1e('source_url', 'Link nguồn https://…', '0'),
h('div', { class: 'bds-row bds-wrap', style: { alignItems: 'center' } },
/^https?:/.test(_o11.source_url || '') ? K.linkBtn('Mở nguồn', _o11.source_url, null, { target: '_blank', icon: 'external', testid: `fig-src-${_o1b}-${_o1k}` }) : null,
h('label', { class: 'bds-check' }, chk, ' Đã kiểm'), badge,
K.button('', () => { sc.figures.splice(_o1k, 1); _ox(true); }, { icon: 'x', title: 'Bỏ số liệu này', testid: `fig-del-${_o1b}-${_o1k}` })));
}));
_o2v[_o1b] = h('div');
return h('div', { class: 'bds-item', style: _o2, 'data-testid': `scene-ed-${_o1b}` },
h('div', { class: 'bds-row bds-wrap' }, h('strong', null, `Cảnh ${_o1b + 1}/${_o1r}`), kind,
K.button('', () => { if (_o1b) { [_o3e.outline.scenes[_o1b - 1], _o3e.outline.scenes[_o1b]] = [sc, _o3e.outline.scenes[_o1b - 1]]; _ox(true); } }, { icon: 'up', title: 'Lên', testid: `sc-up-${_o1b}` }),
K.button('', () => { if (_o1b < _o1r - 1) { [_o3e.outline.scenes[_o1b + 1], _o3e.outline.scenes[_o1b]] = [sc, _o3e.outline.scenes[_o1b + 1]]; _ox(true); } }, { icon: 'down', title: 'Xuống', testid: `sc-down-${_o1b}` }),
K.button('', () => { _o3e.outline.scenes.splice(_o1b, 1); _ox(true); }, { icon: 'x', title: 'Bỏ cảnh', testid: `sc-del-${_o1b}` })),
K.field('Chữ trên hình', title),
K.field('Lời đọc (mỗi dòng 1 câu phụ đề)', _o1s),
sc.kind === 'map' ? K.field('Địa điểm (máy dựng tra trên bản đồ – không thấy thì thành thẻ số liệu)', places) : null,
h('div', { class: 'bds-field' }, h('span', { class: 'bds-field-l' }, 'Số liệu + nguồn'), figs,
K.button('+ Thêm số liệu', () => { sc.figures = sc.figures || []; sc.figures.push({ label: '', value: '', month: '', source_url: '' }); _ox(true); }, { testid: `fig-add-${_o1b}` })),
_o2v[_o1b]);
}
function _o2n() {
scriptBox.innerHTML = ''; _o12 = []; _o2v = [];
const _o3e = _os();
if (!_o3e) { scriptBox.appendChild(h('p', { class: 'bds-muted' }, 'Chọn AI rồi bấm "Soạn kịch bản": app ra dàn cảnh (lời đọc, số liệu + link nguồn từng số) để anh/chị duyệt.')); return; }
const _o3g = st.rec.versions;
scriptBox.appendChild(h('div', { class: 'bds-row bds-wrap' },
h('span', { 'data-testid': 'script-by', style: { minWidth: '0', maxWidth: '100%' } }, (() => { const b = K.badge('Soạn bởi ' + VS.aiLabel(_o3e.ai, _o3e.model), 'info'); b.style.whiteSpace = 'normal'; b.style.maxWidth = '100%'; return b; })(), ` ${_o16(_o3e.at)}` + (_o3e.cost_usd ? ` · ${VS.fmtUsd(_o3e.cost_usd)}` : ' · 0 đồng')),
_o3g.length > 1 ? h('span', { class: 'bds-row bds-wrap' }, _o3g.map((_o3n, _o1k) => K.button(`Bản ${_o1k + 1}: ${VS.aiInfo(_o3n.ai).short}`, () => { st.rec.current = _o1k; st.rec.approved = null; _o2r(); _o2n(); },
{ kind: _o1k === st.rec.current ? 'primary' : 'ghost', icon: 'log', testid: 'ver-' + _o1k }))) : null,
K.button('Soạn lại bằng AI khác', rewriteOther, { icon: 'sparkle', testid: 'script-rewrite' })));
if (_o3g.length > 1) {
const other = _o3g[st.rec.current === _o3g.length - 1 ? _o3g.length - 2 : _o3g.length - 1];
const c = VS.compareVersions(_o3e, other);
const _o2p = (_o1k, label, fmt = _o3n => _o3n) => h('tr', null, h('th', null, label), h('td', null, fmt(c.a[_o1k])), h('td', null, fmt(c.b[_o1k])));
scriptBox.appendChild(h('details', { 'data-testid': 'script-compare', open: true }, h('summary', null, 'So sánh 2 bản'),
h('div', { style: { overflowX: 'auto', maxWidth: '100%' } }, h('table', { class: 'bds-table' }, h('tr', null, h('th', null, ''), h('th', null, 'Bản đang xem'), h('th', null, 'Bản kia')),
_o2p('ai', 'AI soạn'), _o2p('scenes', 'Số cảnh'), _o2p('figures', 'Số liệu'), _o2p('ok', 'Số khớp nguồn'), _o2p('missing', 'Thiếu nguồn'), _o2p('unverified', 'Cần tự kiểm'),
_o2p('seconds', 'Lời đọc (giây)'), _o2p('cost_usd', 'Chi phí', VS.fmtUsd)))));
}
if (_o3e.verify === 'none') scriptBox.appendChild(h('p', { class: 'bds-hint', 'data-testid': 'script-noverify' }, '⚠ Bản này soạn không tìm web (Ollama/chat): link nguồn do AI ghi – mở từng link kiểm rồi tick "Đã kiểm".'));
const _oz = _o3e.evidence || {};
if ((_oz.queries || []).length) {
scriptBox.appendChild(h('div', { class: 'bds-row bds-wrap', 'data-testid': 'search-suggest' }, h('small', { class: 'bds-muted' }, 'Google đã tìm:'),
_oz.queries.map(_o29 => h('a', { class: 'bds-chip', href: 'https://www.google.com/search?q=' + encodeURIComponent(_o29), target: '_blank', rel: 'noopener noreferrer' }, '🔎 ' + _o29))));
}
if ((_oz.sources || []).length) {
scriptBox.appendChild(h('details', { 'data-testid': 'script-sources' }, h('summary', null, `Nguồn AI đã đọc (${_oz.sources.length})`),
h('ul', null, _oz.sources.map(_o2q => h('li', null, h('a', { href: _o2q.url, target: '_blank', rel: 'noopener noreferrer' }, _o2q.title || _o2q.url))))));
}
const _o1t = _o3e.outline;
const _o34 = h('input', { type: 'text', value: _o1t.title, 'data-testid': 'script-title', 'aria-label': 'Tiêu đề video' });
_o34.addEventListener('change', () => { _o1t.title = _o34.value.trim(); _ox(); });
scriptBox.appendChild(K.field('Tiêu đề video (≤ 60 ký tự, từ khoá chính đầu câu)', _o34));
if (_o1t.notes) scriptBox.appendChild(h('p', { class: 'bds-hint' }, '📝 ' + _o1t.notes));
scriptBox.appendChild(h('div', { class: 'bds-list', 'data-testid': 'script-scenes' }, _o1t.scenes.map((sc, _o1b) => _o2u(_o3e, sc, _o1b))));
scriptBox.appendChild(h('div', { class: 'bds-row bds-wrap' }, K.button('+ Thêm cảnh', () => { _o1t.scenes.splice(Math.max(0, _o1t.scenes.length - 1), 0, { kind: 'stat', title: 'Cảnh mới', narration: [], places: [], figures: [] }); _ox(true); }, { testid: 'scene-add' })));
scriptBox.appendChild(summary);
scriptBox.appendChild(h('div', { class: 'bds-row bds-wrap' }, approveBtn, _oe));
_o2c();
if (st.rec.approved) scriptBox.appendChild(h('p', { 'data-testid': 'script-approved-at' }, K.badge('Đã duyệt', 'success'), ` lúc ${_o16(st.rec.approved.at)} – bản do ${VS.aiLabel(st.rec.approved.ai)} soạn`));
_o2e();
}
async function _oc() {
const _o3e = _os(); if (!_o3e) return;
const c = _o2c();
if (!c || !c.ok) { K.toast('Còn lỗi đỏ – sửa trước khi duyệt', 'warn'); return; }
if (c.counts.unverified && !(await K.confirm({ title: 'Còn số liệu chưa khớp kết quả tìm kiếm', testid: 'approve-unverified',
text: `${c.counts.unverified} số có link do AI ghi nhưng chưa khớp đoạn được tìm kiếm xác nhận. Anh/chị đã tự mở link kiểm từng số chưa?`, ok: 'Đã kiểm – vẫn duyệt' }))) return;
st.rec.approved = { at: Date.now(), version: _o3e.id, ai: _o3e.ai };
await _o2r();
approvedBox.innerHTML = '';
if (online()) {
approvedBox.appendChild(h('p', { class: 'bds-hint', 'data-testid': 'approve-online' }, '✓ Đã duyệt. Bấm "Làm bằng AI trên mạng ngay" bên dưới: AI tạo 1 clip ngắn minh hoạ (thu phí theo nhà cung cấp, app hỏi trước).'));
_o2n(); if (_o2d && !_o2d.hidden()) { _o2d.rerender(); _o2d.focus(); } return;
}
if (!st.health) await refreshHealth();
if (!st.health) {
approvedBox.appendChild(h('p', { class: 'bds-hint', 'data-testid': 'approve-need-engine' }, _o5
? '✓ Đã duyệt. Chọn cách làm ở mục "Gửi video đi" bên dưới: Gửi máy tính dựng (miễn phí – máy tính của anh/chị dựng khi bật) / Làm bằng AI trên mạng ngay (thu phí riêng).'
: '✓ Đã duyệt. Bật máy dựng trên máy tính này rồi bấm Duyệt lại để tra vị trí trên bản đồ và tạo cfg.json' + (_o2d.hidden() ? '.' : ' – hoặc chọn cách dựng ở mục "Gửi video đi" bên dưới: Gửi máy tính dựng (miễn phí) / Làm bằng AI trên mạng (thu phí riêng).')));
_o2n(); if (_o2d && !_o2d.hidden()) { _o2d.rerender(); _o2d.focus(); } return;
}
approvedBox.appendChild(h('p', { class: 'bds-muted' }, 'Máy dựng đang tra vị trí trên bản đồ (1 địa điểm/giây) và tạo cfg.json…'));
let r;
try { r = await _o0('/video/outline_cfg', { method: 'POST', body: { outline: VS.toEngineOutline(_o3e.outline, { channel: channelName() }) }, timeout: 90000 }); }
catch (e) {
approvedBox.innerHTML = '';
approvedBox.appendChild(h('p', { class: 'bds-error', 'data-testid': e.code === 'MAP_KEY_REQUIRED' ? 'map-key-required' : null }, '✗ ' + (e.message || 'Máy dựng chưa tạo được cfg')));
if (e.code === 'MAP_KEY_REQUIRED' || e.code === 'MAP_QUOTA') approvedBox.appendChild(h('p', null,
K.button(e.code === 'MAP_QUOTA' ? 'Xem hạn mức bản đồ' : 'Thêm khoá bản đồ', () => { location.hash = '#/settings/connection/map'; }, { kind: 'primary', icon: 'key', testid: 'map-key-open' })));
return;
}
cfgTa.value = JSON.stringify(r.cfg, null, 1); _o1m(); validate();
st.recOut = { ...(st.recOut || {}), cfg_at: Date.now(), places: r.places, distances: r.distances };
await _o2r();
approvedBox.innerHTML = '';
approvedBox.appendChild(h('p', null, K.badge('Đã duyệt + tạo cfg.json', 'success'), ` ${r.cfg.scenes.length} cảnh · ${r.stats.found}/${r.stats.places} địa điểm tìm thấy trên bản đồ`));
if ((r.places || []).length) approvedBox.appendChild(h('ul', { class: 'bds-note' }, r.places.map((_o1y, _o1b) => h('li', { 'data-testid': 'geo-' + _o1b },
_o1y.found ? ['✓ ', _o1y.query, ' → ', _o1y.osm_url ? h('a', { href: _o1y.osm_url, target: '_blank', rel: 'noopener noreferrer' }, `${_o1y.lat}, ${_o1y.lon} (OpenStreetMap)`) : `${_o1y.lat}, ${_o1y.lon}`]
: ['✗ ', _o1y.query, ': ', _o1y.reason || 'không thấy', ' → thẻ số liệu']))));
for (const _ot of r.distances || []) approvedBox.appendChild(h('p', { 'data-testid': 'geo-distance' }, `📏 ${_ot.from} → ${_ot.to}: ${_ot.label}` + (_ot.road_km ? ` (chim bay ${String(_ot.straight_km).replace('.', ',')} km; nguồn ${_ot.road_source})` : '')));
for (const _o3h of r.warnings || []) approvedBox.appendChild(h('p', { class: 'bds-muted' }, '⚠ ' + _o3h));
approvedBox.appendChild(h('p', { class: 'bds-hint' }, 'Bước tiếp: "3. Xem trước" để xem ảnh nháp từng cảnh (gửi được về điện thoại), ưng thì "4. Dựng bản đẹp".'));
_o2n();
}
async function _o3l(ai = _ob.value) {
const _o3e = _os(); if (!_o3e) { K.toast('Soạn dàn cảnh trước', 'warn'); return; }
let r;
try { r = await _og(ai, VS.buildCaptionPrompt(_o3e.outline, { channel: _o24() }), 'caption'); } catch (e) { if (K.isAiCancel(e)) return; K.toast('AI chưa soạn được caption: ' + (e.message || ''), 'warn'); return; }
if (!r) return;
const caps = VS.parseCaptions(r.text);
if (!caps) { K.toast('AI trả lời caption không đúng dạng – thử lại hoặc chọn AI khác', 'warn'); return; }
st.rec.captions = { ...caps, ai: r.ai, model: r.model, at: Date.now(), cost_usd: r.cost_usd || 0 };
await _o2r(); _o2e();
K.toast('Đã soạn caption bằng ' + VS.aiLabel(r.ai, '', { search: false }), 'success');
}
function _o2e() {
_oh.innerHTML = '';
const _o3e = _os(); if (!_o3e) return;
const caps = st.rec.captions;
_oh.appendChild(h('div', { class: 'bds-row bds-wrap' }, _o35(K.button(caps ? 'Soạn lại caption' : 'Soạn caption + hashtag', () => _o3l(), { icon: 'sparkle', testid: 'caption-write' }), 'video_caption'),
caps ? h('small', { class: 'bds-muted', 'data-testid': 'caption-by' }, `Soạn bởi ${VS.aiLabel(caps.ai, caps.model, { search: false })} · ${_o16(caps.at)}`) : h('small', { class: 'bds-muted' }, 'Dùng cùng AI đang chọn ở trên.')));
if (!caps) return;
for (const [_o1k, P] of Object.entries(VS.PLATFORMS)) {
const c = caps[_o1k] || (caps[_o1k] = { title: '', caption: '', hashtags: [] });
const chk = h('div', { 'data-testid': 'cap-check-' + _o1k });
const _oq = h('small', { class: 'bds-muted' });
const _o2b = () => {
const r = VS.checkCaption(_o1k, c, _o3e.outline);
chk.innerHTML = '';
for (const _o1h of r.issues) chk.appendChild(h('div', { class: _o1h.level === 'block' ? 'bds-error' : 'bds-muted' }, (_o1h.level === 'block' ? '✗ ' : '⚠ ') + _o1h.message));
_oq.textContent = `${(c.caption || '').length} ký tự · ${c.hashtags.length} hashtag`;
};
const title = P.title_max ? h('input', { type: 'text', value: c.title, 'data-testid': 'cap-title-' + _o1k, 'aria-label': 'Tiêu đề ' + P.label }) : null;
if (title) title.addEventListener('input', () => { c.title = title.value; _o2b(); });
const ta = h('textarea', { rows: 4, value: c.caption, 'data-testid': 'cap-text-' + _o1k, 'aria-label': 'Caption ' + P.label });
ta.addEventListener('input', () => { c.caption = ta.value; _o2b(); });
const _o36 = h('input', { type: 'text', value: c.hashtags.join(' '), 'data-testid': 'cap-tags-' + _o1k, 'aria-label': 'Hashtag ' + P.label });
_o36.addEventListener('input', () => { c.hashtags = _o36.value.split(/[\s,]+/).filter(Boolean).map(_o3n => _o3n.replace(/^#*/, '#')); _o2b(); });
for (const _o3n of [title, ta, _o36]) if (_o3n) _o3n.addEventListener('change', () => { clearTimeout(_o2s); _o2s = setTimeout(_o2r, 400); });
_oh.appendChild(h('div', { class: 'bds-item', style: _o2, 'data-testid': 'cap-' + _o1k },
h('div', { class: 'bds-row-main' }, h('strong', null, P.label), _oq),
title ? K.field(`Tiêu đề (≤ ${P.title_max} ký tự)`, title) : null,
K.field('Caption', ta), K.field(`Hashtag (nên ${P.tags_min}–${P.tags_max})`, _o36), chk,
h('div', { class: 'bds-row bds-wrap' }, K.button('Chép', async () => {
const r = VS.checkCaption(_o1k, c, _o3e.outline);
if (!r.ok) K.toast('Caption còn lỗi đỏ – soát trước khi đăng', 'warn');
await K.copy((_o1k === 'shorts' && c.title ? c.title + '\n\n' : '') + VS.formatCaption(_o1k, c)); K.toast('Đã chép caption ' + P.label, 'success');
}, { kind: 'primary', testid: 'cap-copy-' + _o1k }))));
_o2b();
}
}
function validate() {
const r = V.validateMapCfg(cfgTa.value);
st.cfgOk = r.ok ? r.cfg : null;
cfgMsg.innerHTML = '';
if (r.ok) cfgMsg.appendChild(h('p', null, K.badge('JSON hợp lệ', 'success'), ` ${r.scenes} cảnh · khoảng ${r.seconds} giây`));
for (const e of r.errors) cfgMsg.appendChild(h('p', { class: 'bds-error' }, '✗ ' + e));
for (const _o3h of r.warnings) cfgMsg.appendChild(h('p', { class: 'bds-muted' }, '⚠ ' + _o3h));
return r;
}
const _o2z = () => {
const c = st.cfgOk || {};
const t = c.title || (c.scenes && c.scenes[0] && c.scenes[0].title && c.scenes[0].title.text) || topic.value.split('\n')[0] || 'video_ban_do';
return String(t).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/gi, 'd').replace(/[^a-z0-9]+/gi, '_').replace(/^_|_$/g, '').toLowerCase().slice(0, 50) || 'video_ban_do';
};
async function _o2t(jobId, key, kind) {
const title = (st.cfgOk && st.cfgOk.title) || _o2z();
const line = h('p', { class: 'bds-muted' }, kind === 'draft' ? 'Đang gửi nháp về điện thoại…' : 'Đang lưu video lên Drive…');
driveBox.innerHTML = ''; driveBox.appendChild(line);
try {
const _o1d = await _o0('/video/file_info?job=' + encodeURIComponent(jobId) + '&key=' + encodeURIComponent(key));
const _o10 = (_o1d.name.match(/\.[a-z0-9]+$/i) || ['.mp4'])[0];
const name = new Date().toISOString().slice(0, 10) + '_' + _o2z() + (kind === 'draft' ? '_nhap' : '') + _o10;
const _o2q = await K.api('video.drive_start', { name, mime: _o1d.mime, size: _o1d.size, kind });
const _o3b = await _o0('/video/drive_upload', { method: 'POST', body: { job: jobId, key, upload_url: _o2q.upload_url }, timeout: 20000 });
let _o3a = _o3b;
for (let _o1b = 0; _o1b < 2400 && _o3a.state === 'running'; _o1b++) {
await new Promise(r => setTimeout(r, 1500));
try { _o3a = await _o0('/video/drive_upload/' + _o3b.id); } catch { continue; }
line.textContent = `Đang tải lên Drive… ${Math.round((_o3a.sent || 0) / Math.max(1, _o3a.total) * 100)}%`;
}
if (_o3a.state !== 'done' || !_o3a.file_id) throw new Error(_o3a.error || 'Tải lên Drive chưa xong');
const caps = st.rec && st.rec.captions;
const _o3e = _os();
const _o14 = await K.api('video.drive_finish', { file_id: _o3a.file_id, kind, title, send_telegram: true, ai_voice: kind === 'final' && voiceMap.checked,
caption_text: kind === 'final' && caps ? VS.captionFile(caps, _o3e && _o3e.outline) : '', tg_caption: kind === 'final' && caps && caps.tiktok ? VS.formatCaption('tiktok', caps.tiktok) : '' });
driveBox.innerHTML = '';
const _o37 = { video: 'đã gửi video về Telegram', photo: 'đã gửi ảnh nháp về Telegram', link: 'đã gửi link Drive về Telegram (tệp lớn hơn 50 MB)', off: 'chưa cài Telegram – mở link Drive trên điện thoại' }[_o14.telegram] || 'Telegram chưa nhận – mở link Drive trên điện thoại';
driveBox.appendChild(h('p', null, K.badge(kind === 'draft' ? 'Nháp đã lên Drive' : 'Đã lưu Drive', 'success'), ' ',
h('a', { href: _o14.file.url, target: '_blank', rel: 'noopener', 'data-testid': 'drive-link' }, `Mở trên Drive (${_o14.folder})`), ` · ${_o37}`));
if (st.rec) { st.recOut = { ...(st.recOut || {}), [kind === 'draft' ? 'draft' : 'drive']: { file_id: _o14.file.id, url: _o14.file.url, telegram: _o14.telegram, at: Date.now() } }; _o2r(); }
K.toast(kind === 'draft' ? 'Đã gửi nháp về điện thoại' : 'Đã lưu Drive + gửi điện thoại', 'success');
} catch (e) {
driveBox.innerHTML = '';
driveBox.appendChild(h('p', { class: 'bds-error' }, '✗ Chưa lưu được lên Drive: ' + (e.message || '') + ' ', K.button('Thử lại', () => _o2t(jobId, key, kind), { testid: 'drive-retry' })));
}
}
async function _o1p(mode) {
const r = validate();
if (!r.ok) { K.toast(cfgTa.value.trim() ? 'Sửa cfg.json trước' : 'Duyệt dàn cảnh trước (máy dựng sẽ tạo cfg.json)', 'warn'); return; }
if (!st.health) { await refreshHealth(); if (!st.health) { K.toast('Máy dựng chưa bật', 'warn'); return; } }
if (mode === 'mp4' && voiceMap.checked && !(await K.aiConfirm('vbee_voice', { testid: 'vbee-cost', lead: 'Dựng bản đẹp có giọng đọc Vbee (dịch vụ giọng đọc tiếng Việt, tính phí theo ký tự trên tài khoản Vbee của anh/chị). Bỏ tick "Giọng Vbee" nếu muốn dựng không giọng (0 đồng).' }))) return;
const name = _o2z();
try {
const id = await _o31({ type: 'video_map', cfg: r.cfg, mode, name, title: (mode === 'mp4' ? 'Bản đẹp · ' : mode === 'stills' ? 'Bản nháp · ' : 'Kiểm tra · ') + name, voice: mode === 'mp4' && voiceMap.checked },
{ mode, topic: topic.value.slice(0, 500), script_id: st.scriptId || '' });
previewBox.innerHTML = '';
previewBox.appendChild(h('p', { class: 'bds-muted' }, mode === 'mp4' ? 'Đang dựng bản đẹp… (vài phút; xem tiến độ ở mục Job bên dưới)' : 'Đang dựng bản nháp…'));
const _o1i = await _o3i(id);
if (!_o1i) return;
previewBox.innerHTML = '';
if (_o1i.state !== 'done') { previewBox.appendChild(h('p', { class: 'bds-error' }, '✗ ' + (_o1i.error || 'Dựng lỗi'))); previewBox.appendChild(h('pre', { class: 'bds-pre bds-scroll' }, (_o1i.log || '').slice(-2500))); return; }
if (_o1i.warnings && _o1i.warnings.length) previewBox.appendChild(h('div', null, _o1i.warnings.map(_o3h => h('p', { class: 'bds-muted' }, '⚠ ' + _o3h))));
if (mode === 'check') previewBox.appendChild(h('pre', { class: 'bds-pre bds-scroll' }, (_o1i.log || '').slice(-2000)));
if (mode === 'stills' && _o1i.outputs.contact) {
previewBox.appendChild(h('img', { src: _o13(id, 'contact') + '?t=' + Date.now(), alt: 'Ảnh nháp các cảnh', style: { maxWidth: 'min(100%, 560px)', borderRadius: '10px' } }));
previewBox.appendChild(h('div', { class: 'bds-row bds-wrap' },
K.button('Duyệt bản nháp → Dựng bản đẹp', () => _o1p('mp4'), { kind: 'primary', icon: 'check', testid: 'map-approve' }),
K.button('Gửi nháp về điện thoại', () => _o2t(id, 'contact', 'draft'), { icon: 'phone', testid: 'map-draft-phone' }),
h('span', { class: 'bds-muted' }, 'Chưa ưng: sửa dàn cảnh, Duyệt lại rồi "Xem trước".')));
}
if (mode === 'mp4' && _o1i.outputs.mp4) {
previewBox.appendChild(h('video', { src: _o13(id, 'mp4'), controls: true, playsinline: true, style: { width: '100%', maxWidth: '360px', borderRadius: '10px', background: '#000' } }));
previewBox.appendChild(h('div', { class: 'bds-row bds-wrap' }, K.linkBtn('Tải MP4', _o13(id, 'mp4'), null, { kind: 'primary', icon: 'download', target: '_blank' }),
K.button('Lưu Drive + gửi điện thoại', () => _o2t(id, 'mp4', 'final'), { icon: 'cloud', testid: 'map-save-phone' }),
_o1i.outputs.srt ? K.linkBtn('Phụ đề .srt', _o13(id, 'srt'), null, { target: '_blank', icon: 'download' }) : null,
_o1i.outputs.cover ? K.linkBtn('Ảnh bìa', _o13(id, 'cover'), null, { target: '_blank', icon: 'download' }) : null));
previewBox.appendChild(h('p', { class: 'bds-muted' }, 'Anh/chị tự đăng TikTok bằng tay. ' + V.AI_LABEL_REMINDER));
if (autoSave.checked) _o2t(id, 'mp4', 'final');
}
} catch (e) {
K.toast(e.code === 'BUSY' ? 'Máy đang bận, thử lại sau' : e.message, 'warn');
}
}
async function openRoad() {
let _or = null;
try { _or = await _o0('/video/road'); } catch (e) { K.toast(e.message, 'warn'); return; }
const _o25 = K.select([['off', 'Tắt – chỉ ghi "đường chim bay"'], ['geoapify', 'Geoapify (khoá miễn phí, cho phép dùng thương mại)'], ['osrm', 'Máy chủ OSRM của anh/chị']], _or.provider, { 'data-testid': 'road-provider' });
const key = h('input', { type: 'password', autocomplete: 'off', placeholder: _or.key_set ? 'Đã có khoá – để trống nếu giữ nguyên' : 'Khoá API Geoapify', 'data-testid': 'road-key' });
const url = h('input', { type: 'url', value: _or.osrm_url || '', placeholder: 'http://192.168.1.10:5000', 'data-testid': 'road-osrm' });
const _o1o = K.modal({ title: 'Khoảng cách đường đi', testid: 'road-modal', body: h('div', { class: 'bds-form' },
h('p', { class: 'bds-muted' }, 'Máy dựng mặc định chỉ đo đường chim bay và ghi rõ "đường chim bay" trên video. Gói Free của Geoapify không cần thẻ – vượt hạn mức thì bị từ chối, không tự tính tiền. Muốn ghi quãng đường đi: dùng Geoapify (gói Free cho phép thương mại khi ghi nguồn, 3.000 lượt/ngày – tạo khoá miễn phí tại geoapify.com) hoặc máy chủ OSRM riêng. App KHÔNG dùng máy chủ thử OSRM công khai (cấm dùng cho sản phẩm).'),
K.field('Nguồn', _o25), K.field('Khoá Geoapify (lưu trong Keychain của Mac)', key), K.field('Địa chỉ OSRM riêng', url),
h('div', { class: 'bds-row bds-end' }, K.button('Huỷ', () => _o1o.close()), K.button('Lưu', async () => {
try { await _o0('/video/road', { method: 'POST', body: { provider: _o25.value, key: key.value.trim() || undefined, osrm_url: url.value.trim() } }); _o1o.close(); K.toast('Đã lưu cách tính khoảng cách', 'success'); }
catch (e) { K.toast(e.message, 'warn'); }
}, { kind: 'primary', testid: 'road-save' }))) });
}
const _o17 = _o30(_o3) || {};
const _o1e = (attrs, _o3e) => h('input', { ...attrs, value: _o3e ?? '' });
const projList = h('datalist', { id: 'bds-video-projects' }, K.projects().map(_o1y => h('option', { value: _o1y.name })));
const _o11 = {
project: _o1e({ type: 'text', list: 'bds-video-projects', placeholder: 'vd: tên dự án (gõ hoặc chọn từ Bảng hàng)', 'data-testid': 'flow-project' }, _o17.project),
type: _o1e({ type: 'text', placeholder: 'vd: 2 phòng ngủ' }, _o17.type),
area: _o1e({ type: 'number', min: 20, max: 500, step: 0.1, inputmode: 'decimal', placeholder: 'm²' }, _o17.area),
bedrooms: K.select([['1', '1'], ['2', '2'], ['3', '3+']], _o17.bedrooms || '2'),
balcony: _o1e({ type: 'text', placeholder: 'vd: Đông Nam (tính theo ban công)' }, _o17.balcony),
style: _o1e({ type: 'text', placeholder: 'Phong cách nội thất (tiếng Anh càng tốt): modern, light oak…' }, _o17.style),
description: h('textarea', { rows: 2, placeholder: 'Mô tả căn: sofa chữ L, bếp đảo, cửa kính lớn…', value: _o17.description || '' }),
person: h('textarea', { rows: 2, placeholder: 'Mô tả nhân vật: nam ~40 tuổi, tóc ngắn, vest xanh than, sơ mi trắng…', 'data-testid': 'flow-person', value: _o17.person || '' }),
scenes: _o1e({ type: 'number', min: 1, max: V.MAX_SCENES, step: 1, inputmode: 'numeric', 'data-testid': 'flow-scenes' }, _o17.scenes || 6),
model: K.select([['fast', 'Veo Fast (tiết kiệm)'], ['quality', 'Veo Quality (đẹp hơn, tốn hơn)']], _o17.model || 'fast'),
illustrative: h('input', { type: 'checkbox', checked: _o17.illustrative !== false }),
aptPhotos: h('input', { type: 'file', accept: 'image/*', multiple: true }),
portrait: h('input', { type: 'file', accept: 'image/*' }),
};
const thumbs = h('div', { class: 'bds-row bds-wrap' });
const _o2y = () => {
thumbs.innerHTML = '';
for (const file of [...(_o11.aptPhotos.files || []), ...(_o11.portrait.files || [])].slice(0, 8)) {
thumbs.appendChild(h('img', { src: URL.createObjectURL(file), alt: file.name, style: { width: '64px', height: '96px', objectFit: 'cover', borderRadius: '6px' } }));
}
};
_o11.aptPhotos.addEventListener('change', _o2y); _o11.portrait.addEventListener('change', _o2y);
ensureCharCss();
const _ol = charLibrary(ctx);
st.character = null;
const charPick = h('div', { class: 'bds-charpick', 'data-testid': 'flow-char-pick' });
const _oi = h('div', { 'data-testid': 'flow-char-info' });
const vbeeList = h('datalist', { id: 'bds-vbee-voices' }, Ch.VBEE_VOICES.map(_o3e => h('option', { value: _o3e.code }, _o3e.label)));
const vbeeVoice = h('input', { type: 'text', list: 'bds-vbee-voices', value: _o17.vbee_voice || '', placeholder: Ch.DEFAULT_VOICE.male + ' (mặc định máy dựng)', 'data-testid': 'flow-vbee-voice', autocomplete: 'off' });
async function _o2g() {
const rows = await _ol.list();
charPick.innerHTML = '';
const _o1w = (c, label, extra = {}) => h('button', { type: 'button', class: 'bds-charopt' + ((st.character ? st.character.id : null) === (c ? c.id : null) ? ' bds-on' : ''),
'aria-pressed': String((st.character ? st.character.id : null) === (c ? c.id : null)), onclick: () => _o2w(c), ...extra },
c ? charAvatar(_ol, c, { small: true }) : K.icon('x'), h('span', null, label));
charPick.appendChild(_o1w(null, 'Không chọn', { 'data-testid': 'pick-char-none' }));
for (const c of rows) charPick.appendChild(_o1w(c, c.name, { 'data-testid': 'pick-char-' + c.id, title: c.kind === 'real' ? 'Người thật' : 'Nhân vật AI' }));
charPick.appendChild(h('button', { type: 'button', class: 'bds-charopt bds-new', 'data-testid': 'flow-char-new', onclick: () => { _o1l(); ctx.nav ? ctx.nav('content/characters?new=ai&from=video') : (location.hash = '#/content/characters?new=ai&from=video'); } }, K.icon('plus'), h('span', null, 'Tạo nhân vật mới')));
return rows;
}
function _o2f() {
_oi.innerHTML = '';
const c = st.character;
_o11.person.disabled = !!c;
if (!c) return;
_oi.appendChild(h('div', { class: 'bds-form' },
h('p', { class: 'bds-hint', style: { margin: 0 } }, `🧑‍💼 ${c.name}: câu khoá dưới đây được chèn NGUYÊN VĂN vào mọi cảnh. Trong Flow, dùng ảnh tham chiếu "${c.name}" trong Ingredients cho mọi cảnh.`),
h('details', null, h('summary', null, 'Câu khoá nhân vật (lock_en)'), h('pre', { class: 'bds-pre bds-promptbox', 'data-testid': 'flow-char-lock' }, c.lock_en)),
!c.has_photo ? h('small', { class: 'bds-muted' }, '⚠ Nhân vật chưa có ảnh – tạo ảnh chân dung trong mục Nhân vật trước khi làm Flow.') : null));
}
function _o2w(c) {
st.character = c ? Ch.forFlow(c) : null;
if (c && c.voice) vbeeVoice.value = c.voice;
_o2f(); _o1l();
for (const b of charPick.querySelectorAll('.bds-charopt')) { const on = b.dataset.testid === (c ? 'pick-char-' + c.id : 'pick-char-none'); b.classList.toggle('bds-on', on); b.setAttribute('aria-pressed', String(on)); }
if (st.plan) makePlan();
}
vbeeVoice.addEventListener('change', () => _o1l());
const _o1l = () => _o30(_o3, { project: _o11.project.value, type: _o11.type.value, area: _o11.area.value, bedrooms: _o11.bedrooms.value, balcony: _o11.balcony.value,
style: _o11.style.value, description: _o11.description.value, person: _o11.person.value, scenes: _o11.scenes.value, model: _o11.model.value,
illustrative: _o11.illustrative.checked, voices: st.plan ? st.plan.scenes.map(_o2q => _o2q.voice) : _o17.voices,
character: st.character ? st.character.id : null, vbee_voice: vbeeVoice.value.trim() });
for (const _o3n of Object.values(_o11)) if (_o3n.tagName !== 'INPUT' || _o3n.type !== 'file') _o3n.addEventListener('change', _o1l);
async function describeFromPhotos() {
const files = [...(_o11.portrait.files || []), ...(_o11.aptPhotos.files || [])].slice(0, 4);
if (!files.length) { K.toast('Chọn ảnh trước', 'warn'); return; }
if (!ctx.ai || !ctx.ai.run) { K.toast('Chưa bật AI', 'warn'); return; }
try {
const images = await Promise.all(files.map(toB64));
const r = await ctx.ai.run('script', { json: true, images, feature: 'video_describe', prompt:
'Describe for a video generator, in concise English. Return JSON {"person": "...", "apartment": "..."}: person = apparent age range, hair, outfit, build (no names); ' +
'apartment = layout, furniture, materials, colours, light. No text in the scene.' });
const _ot = V.parseData(V.extractJson((r && r.text) || ''));
if (_ot.person && _o11.portrait.files.length) _o11.person.value = _ot.person;
if (_ot.apartment) _o11.description.value = _ot.apartment;
_o1l(); K.toast('Đã điền mô tả từ ảnh – anh/chị soát lại', 'success');
} catch (e) { if (K.isAiCancel(e)) return; K.toast((e && e.message) || 'AI chưa trả lời', 'warn'); }
}
function makePlan() {
st.plan = V.buildFlowPlan({
apartment: { project: _o11.project.value, type: _o11.type.value, area: _o11.area.value, bedrooms: _o11.bedrooms.value, balcony: _o11.balcony.value,
style: _o11.style.value, description: _o11.description.value, photos: (_o11.aptPhotos.files || []).length },
person: { description: _o11.person.value, has_photo: (_o11.portrait.files || []).length > 0 || !_o11.person.value },
character: st.character,
scenes: _o11.scenes.value, model: _o11.model.value,
});
if (_o17.voices && _o17.voices.length === st.plan.scenes.length && st.restoring) st.plan.scenes.forEach((_o2q, _o1b) => { _o2q.voice = _o17.voices[_o1b] || _o2q.voice; });
st.restoring = false;
_o1l(); _o2l();
}
function _o2l() {
flowOut.innerHTML = '';
if (!st.plan) return;
const _o1y = st.plan;
flowOut.appendChild(h('p', null, K.badge('Ước tính', 'info'), ' ', _o1y.credits.text));
flowOut.appendChild(h('div', { class: 'bds-row bds-wrap' },
K.button('Mở Flow', () => window.open(V.FLOW_URL, '_blank', 'noopener'), { kind: 'primary', testid: 'open-flow' }),
K.button('Chép tất cả lời nhắn', async () => { await K.copy(_o1y.scenes.map(_o2q => `--- Cảnh ${_o2q.index + 1}: ${_o2q.title}${_o1y.reference_hint ? ' · ' + _o1y.reference_hint : ''} ---\n${_o2q.prompt}`).join('\n\n')); K.toast('Đã chép', 'success'); }, { testid: 'copy-all-prompts' })));
if (_o1y.reference_hint) flowOut.appendChild(h('p', { class: 'bds-hint', 'data-testid': 'flow-ref-hint' }, '🧑‍💼 ' + _o1y.reference_hint + ' Giọng đọc: ' + (Ch.voiceLabel(vbeeVoice.value.trim()) || 'mặc định máy dựng') + '.'));
flowOut.appendChild(h('ol', { class: 'bds-note bds-muted' },
h('li', null, 'Trong Flow: tạo dự án mới, chọn khung dọc 9:16, tải ảnh chân dung + ảnh căn hộ làm ảnh tham chiếu (Ingredients / Frames to video).'),
h('li', null, 'Mỗi cảnh: chép lời nhắn → dán → tạo. Cảnh sau dùng khung cuối của cảnh trước nếu Flow cho phép (Extend / Jump to) để liền mạch.'),
h('li', null, 'Tải từng clip về, đặt tên 1.mp4, 2.mp4… rồi kéo thả vào ô bên dưới.')));
_o1y.scenes.forEach((_o2q, _o1b) => {
const voice = h('textarea', { rows: 2, value: _o2q.voice, 'data-testid': 'flow-voice-' + _o1b });
const _o15 = h('small', { class: 'bds-muted' });
const _o3c = () => {
_o2q.voice = voice.value; const _o3e = V.voiceFits(_o2q.voice); const _od = V.findForbidden(_o2q.voice);
_o15.textContent = (_o3e.ok ? '✓ ' : '⚠ dài quá, ') + `đọc ~${_o3e.seconds_needed}/${_o2q.seconds} giây` + (_od.length ? ' · nên bỏ: ' + _od.join(', ') : '');
_o1l();
};
voice.addEventListener('input', _o3c); _o3c();
flowOut.appendChild(h('div', { class: 'bds-item', style: _o2, 'data-testid': 'flow-scene-' + _o1b },
h('div', { class: 'bds-row-main' }, h('strong', null, `Cảnh ${_o1b + 1}/${_o1y.scenes.length} · ${_o2q.title}`), h('span', { class: 'bds-sub' }, `${_o2q.seconds} giây · 9:16`)),
h('details', null, h('summary', null, 'Lời nhắn Flow (tiếng Anh)'), h('pre', { class: 'bds-pre' }, _o2q.prompt)),
_o1y.reference_hint ? h('small', { class: 'bds-muted', 'data-testid': 'flow-scene-ref-' + _o1b }, '📎 ' + _o1y.reference_hint) : null,
h('div', { class: 'bds-row bds-wrap' }, K.button('Chép lời nhắn', async () => { await K.copy(_o2q.prompt); K.toast(`Đã chép cảnh ${_o1b + 1}`, 'success'); }, { kind: 'primary', testid: 'copy-prompt-' + _o1b })),
K.field('Lời đọc tiếng Việt', voice), _o15));
});
}
const _om = h('input', { type: 'file', accept: 'video/mp4,video/quicktime,video/*,image/*', multiple: true, 'data-testid': 'flow-clip-input' });
const musicInput = h('input', { type: 'file', accept: 'audio/*' });
const voiceFlow = h('input', { type: 'checkbox', checked: true, 'data-testid': 'flow-voice' });
const flowBrand = h('input', { type: 'checkbox', checked: true });
const _o8 = files => {
const list = [...files].filter(_o3n => /^(video|image)\//.test(_o3n.type) || /\.(mp4|mov|m4v|webm|jpe?g|png|webp)$/i.test(_o3n.name));
st.clips = V.orderClips([...st.clips, ...list]);
_o2h();
};
_om.addEventListener('change', () => { _o8(_om.files); _om.value = ''; });
musicInput.addEventListener('change', () => { st.music = musicInput.files[0] || null; });
const drop = h('div', { class: 'bds-empty', tabindex: '0', role: 'button', 'data-testid': 'flow-drop', style: { border: '2px dashed currentColor', padding: '18px', cursor: 'pointer', textAlign: 'center' },
onclick: () => _om.click(), onkeydown: e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); _om.click(); } },
ondragover: e => { e.preventDefault(); }, ondrop: e => { e.preventDefault(); _o8(e.dataTransfer.files || []); } },
K.icon('plus'), ' Kéo thả clip tải từ Flow vào đây (hoặc bấm để chọn). Ảnh 3D/phối cảnh cũng được – sẽ có chữ "Ảnh minh hoạ".');
function _o2h() {
clipList.innerHTML = '';
const _o1r = st.plan ? st.plan.scenes.length : 0;
if (st.clips.length && _o1r && st.clips.length !== _o1r) clipList.appendChild(h('p', { class: 'bds-muted' }, `⚠ Có ${st.clips.length} clip nhưng kịch bản ${_o1r} cảnh – lời đọc ghép theo thứ tự clip.`));
st.clips.forEach((c, _o1b) => clipList.appendChild(h('div', { class: 'bds-item', style: _o2 },
h('div', { class: 'bds-row-main' }, h('strong', null, `${_o1b + 1}. ${c.name}`), h('span', { class: 'bds-sub' }, Math.round(c.size / 1e5) / 10 + ' MB')),
h('div', { class: 'bds-row' },
K.button('', () => { if (_o1b) { [st.clips[_o1b - 1], st.clips[_o1b]] = [st.clips[_o1b], st.clips[_o1b - 1]]; _o2h(); } }, { icon: 'up', title: 'Lên' }),
K.button('', () => { if (_o1b < st.clips.length - 1) { [st.clips[_o1b + 1], st.clips[_o1b]] = [st.clips[_o1b], st.clips[_o1b + 1]]; _o2h(); } }, { icon: 'down', title: 'Xuống' }),
K.button('', () => { st.clips.splice(_o1b, 1); _o2h(); }, { icon: 'x', title: 'Bỏ' })))));
}
async function composeFlow() {
if (!st.clips.length) { K.toast('Chưa có clip', 'warn'); return; }
if (!st.health) { await refreshHealth(); if (!st.health) { K.toast('Máy dựng chưa bật', 'warn'); return; } }
const _o23 = h('p', { class: 'bds-muted' }, 'Đang gửi clip…');
clipList.appendChild(_o23);
try {
const _o3b = async file => (await _o0('/upload?name=' + encodeURIComponent(file.name), { method: 'POST', body: file, timeout: 15 * 60000, headers: { 'Content-Type': file.type || 'application/octet-stream' } })).path;
const _o20 = [];
for (let _o1b = 0; _o1b < st.clips.length; _o1b++) { _o23.textContent = `Đang gửi clip ${_o1b + 1}/${st.clips.length}…`; _o20.push(await _o3b(st.clips[_o1b])); }
const music = st.music ? await _o3b(st.music) : null;
const voices = st.plan ? st.plan.scenes.map(_o2q => _o2q.voice) : [];
const title = ['Đi trong căn', _o11.project.value, _o11.type.value].filter(Boolean).join(' · ');
_o23.textContent = 'Đã gửi, máy đang ghép…';
const id = await _o31({ type: 'video_flow', title, clips: _o20.map((_o1y, _o1b) => ({ path: _o1y, illustrative: /^image\//.test(st.clips[_o1b].type) })),
script: { lines: V.flowScriptLines(voices.slice(0, _o20.length)) }, voice: voiceFlow.checked, vbee_voice: vbeeVoice.value.trim() || undefined, illustrative: _o11.illustrative.checked,
music, music_volume: 0.15, brand: flowBrand.checked && channelName() ? channelName() : null },
{ clips: _o20.length, project: _o11.project.value, credits: st.plan ? st.plan.credits.high : 0 });
const _o1i = await _o3i(id);
_o23.remove();
if (_o1i && _o1i.state === 'done') { K.toast('Đã ghép xong video', 'success'); _o21(id, 'mp4', title); st.clips = []; _o2h(); }
else if (_o1i) K.toast(_o1i.error || 'Ghép lỗi – xem mục Job', 'warn');
} catch (e) { _o23.remove(); K.toast(e.code === 'BUSY' ? 'Máy đang bận' : e.message, 'warn'); }
}
_o2d = remotePanel(ctx, K, {
outline: () => { const _o3e = _os(); return _o3e && st.rec && st.rec.approved && st.rec.approved.version === _o3e.id ? VS.toEngineOutline(_o3e.outline, { channel: channelName() }) : null; },
title: () => { const _o3e = _os(); return (_o3e && _o3e.outline.title) || topic.value.split('\n')[0].slice(0, 100) || 'Video từ điện thoại'; },
voice: () => voiceMap.checked,
scriptId: () => st.scriptId || '',
captions: () => { const caps = st.rec && st.rec.captions; const _o3e = _os(); return caps ? { caption_text: VS.captionFile(caps, _o3e && _o3e.outline), tg_caption: caps.tiktok ? VS.formatCaption('tiktok', caps.tiktok) : '' } : {}; },
engine: (path, opts) => _o0(path, opts),
local: () => !!st.health,
});
const remoteCard = K.card({ title: _o4 ? 'Làm bằng AI trên mạng ngay' : 'Gửi video đi', testid: 'card-remote', body: _o2d.el });
const _o32 = () => { remoteCard.hidden = _o2d.hidden(); if (!remoteCard.hidden && alive()) _o2d.start().catch(() => { }); };
remoteCard.hidden = _o2d.hidden();
try {
if (ctx.video && typeof ctx.video.on === 'function') {
const off = ctx.video.on(() => {
if (!alive()) { off && off(); return; }
if (online() !== _o4) { off && off(); el.innerHTML = ''; mount(el, ctx).catch(() => { }); return; }
_o32();
});
}
} catch { }
const installCard = _o4 && ctx.video && typeof ctx.video.installCard === 'function' && ctx.ui ? ctx.video.installCard(ctx.ui, {}) : null;
const scriptCard = _o4 ? K.card({ title: 'Kịch bản cho clip AI', testid: 'card-map', body: h('div', { class: 'bds-form', 'data-online': '1' },
K.field('1. Link bài báo / chủ đề', topic),
h('div', { class: 'bds-row bds-wrap' }, K.field('AI soạn', _ob), _o3k),
aiHint,
h('h4', null, '2. Dàn cảnh để duyệt'), scriptBox, approvedBox,
h('h4', null, '3. Caption SEO + hashtag (TikTok · Reels · YouTube Shorts)'), _oh) }) : null;
el.appendChild(_o4 ? h('div', { class: 'bds-screen', 'data-testid': 'video-screen', 'data-mode': 'online' },
h('div', { class: 'bds-head' }, h('h2', null, 'Video')),
scriptCard, remoteCard, installCard) : h('div', { class: 'bds-screen', 'data-testid': 'video-screen' },
h('div', { class: 'bds-head' }, h('h2', null, 'Video')),
K.card({ title: _o5 ? 'Làm video từ điện thoại' : 'Máy dựng trên máy', testid: 'card-engine', body: _oy }),
K.card({ title: 'Video bản đồ / quy hoạch', testid: 'card-map', body: h('div', { class: 'bds-form' },
K.field('1. Link bài báo / chủ đề', topic),
h('div', { class: 'bds-row bds-wrap' }, K.field('AI soạn', _ob), _o3k),
aiHint,
h('h4', null, '2. Dàn cảnh để duyệt'), scriptBox, approvedBox,
h('details', { 'data-testid': 'map-advanced' }, h('summary', null, 'Nâng cao: cfg.json (máy dựng tự tạo sau khi Duyệt)'), cfgTa,
h('div', { class: 'bds-row bds-wrap' }, K.button('Kiểm tra JSON', validate, { testid: 'map-validate-btn' }), K.button('Kiểm tra trên máy dựng', () => _o1p('check'), { icon: 'pulse', testid: 'map-check' }))),
cfgMsg,
_o5 ? null : h('div', { class: 'bds-row bds-wrap' }, K.button('3. Xem trước (ảnh nháp)', () => _o1p('stills'), { kind: 'primary', icon: 'eye', testid: 'map-stills' }),
K.button('Khoảng cách đường đi', openRoad, { icon: 'link', testid: 'road-open' })),
h('label', { class: 'bds-check' }, voiceMap, _o5 ? ' Giọng Vbee khi máy tính dựng' : ' Giọng Vbee khi dựng bản đẹp', K.aiBadge('vbee_voice')),
_o5 ? null : K.aiNote('local_render'),
_o5 ? null : h('label', { class: 'bds-check' }, autoSave, ' Dựng xong tự lưu Drive + gửi về điện thoại (Telegram)'),
_o5 ? null : h('div', { class: 'bds-row bds-wrap' }, K.button('4. Dựng bản đẹp (MP4)', () => _o1p('mp4'), { icon: 'film', testid: 'map-mp4' })),
previewBox, driveBox,
h('h4', null, (_o5 ? '3' : '5') + '. Caption SEO + hashtag (TikTok · Reels · YouTube Shorts)'), _oh) }),
remoteCard,
K.card({ title: 'Nhân vật đi trong căn (Flow)', testid: 'card-flow', body: h('div', { class: 'bds-form' }, projList,
h('p', { class: 'bds-muted' }, 'Clip tạo trong Flow/Veo bằng tín dụng gói Gemini AI Pro; app soạn lời nhắn từng cảnh và ghép video.'),
h('div', { class: 'bds-grid2' },
K.field('Dự án', _o11.project), K.field('Loại căn', _o11.type), K.field('Diện tích (m²)', _o11.area), K.field('Số phòng ngủ', _o11.bedrooms),
K.field('Hướng ban công', _o11.balcony), K.field('Phong cách', _o11.style)),
K.field('Mô tả căn', _o11.description),
h('div', { class: 'bds-grid2' }, K.field('Ảnh căn hộ (để tải lên Flow)', _o11.aptPhotos), K.field('Ảnh chân dung (để tải lên Flow)', _o11.portrait)),
thumbs,
h('div', { class: 'bds-field' }, h('span', { class: 'bds-field-l' }, 'Chọn nhân vật'), charPick, _oi),
K.field('Hoặc mô tả nhân vật (khi không chọn)', _o11.person),
h('div', { class: 'bds-row bds-wrap' }, K.button('Tự mô tả từ ảnh bằng AI', describeFromPhotos, { ai: 'video_describe', icon: 'sparkle', testid: 'flow-describe' })),
h('div', { class: 'bds-grid2' }, K.field('Số cảnh (8 giây/cảnh)', _o11.scenes), K.field('Mô hình', _o11.model)),
h('label', { class: 'bds-check' }, _o11.illustrative, ' Gắn chữ "Ảnh minh hoạ" (phối cảnh/3D)'),
h('div', { class: 'bds-row bds-wrap' }, K.button('Soạn lời nhắn Flow', makePlan, { kind: 'primary', icon: 'chat', testid: 'flow-plan-btn' })),
flowOut,
h('h4', null, 'Ghép clip'), drop, clipList,
K.field('Nhạc nền (tuỳ chọn)', musicInput, 'Không có thì để trống – chọn nhạc thịnh hành trong TikTok khi đăng.'),
h('label', { class: 'bds-check' }, voiceFlow, ' Giọng Vbee đọc lời từng cảnh'),
K.field('Mã giọng Vbee', vbeeVoice, 'Tự điền theo nhân vật đã chọn; để trống thì dùng giọng mặc định của máy dựng.'), vbeeList,
h('label', { class: 'bds-check', 'data-testid': 'flow-brand' }, flowBrand, ' Hiện tên kênh trên video' + (channelName() ? ' ("' + channelName() + '")' : ' (chưa có – điền Tên công ty ở Cài đặt › Thông tin cá nhân)')),
h('div', { class: 'bds-row bds-wrap' }, K.button('Ghép video', composeFlow, { kind: 'primary', icon: 'film', testid: 'flow-compose' }))) }),
_o5 ? null : K.card({ title: 'Job dựng video', testid: 'card-jobs', actions: K.button('Làm mới', loopJobs, { icon: 'refresh' }), body: h('div', null, queuedBody, jobsBody,
h('p', { class: 'bds-muted', 'data-testid': 'ai-label-reminder' }, '📌 ' + V.AI_LABEL_REMINDER + ' App không tự đăng – anh/chị tự đăng tay.')) }),
));
_om.style.display = 'none'; el.appendChild(_om);
try {
const rows = await _o2g();
const _o2a = ctx.route && ctx.route.query && ctx.route.query.get && ctx.route.query.get('char');
const _o3j = _o2a || _o17.character;
const c = _o3j ? rows.find(r => r.id === _o3j) : null;
if (c) { st.character = Ch.forFlow(c); if (_o2a && c.voice) vbeeVoice.value = c.voice; _o2f(); for (const b of charPick.querySelectorAll('.bds-charopt')) b.classList.toggle('bds-on', b.dataset.testid === 'pick-char-' + c.id); }
if (_o2a) setTimeout(() => charPick.scrollIntoView({ block: 'center' }), 300);
} catch { }
if (_o17.voices && _o17.voices.length) { st.restoring = true; makePlan(); }
_o2h(); _o2j();
try { await _o1n(); } catch { }
_o2n();
if (cfgTa.value.trim()) validate();
if (!_o4 && _o5) _o2k();
else if (!_o4) { await refreshHealth(); if (st.health) loopJobs(); else _o2j(); _o2m(); }
if (!alive()) return;
if (!remoteCard.hidden) _o2d.start().catch(() => { });
const _o29 = ctx.route && ctx.route.query;
const _o1j = _o29 && _o29.get && _o29.get('job');
if (_o1j) { st.watching.add(_o1j); setTimeout(() => document.querySelector(`[data-testid="job-${CSS.escape(_o1j)}"]`)?.scrollIntoView({ block: 'center' }), 400); }
const _o38 = setInterval(() => { if (!alive()) { clearInterval(_o38); clearTimeout(st.poll); return; } if (!online() && !_o5) refreshHealth(); }, 30000);
}
function toB64(file, max = 1024) {
return new Promise((_o2o, rej) => {
const _o1c = new Image();
_o1c.onload = () => {
const _o1k = Math.min(1, max / Math.max(_o1c.width, _o1c.height));
const c = document.createElement('canvas'); c.width = Math.round(_o1c.width * _o1k); c.height = Math.round(_o1c.height * _o1k);
c.getContext('2d').drawImage(_o1c, 0, 0, c.width, c.height);
const url = c.toDataURL('image/jpeg', 0.85); URL.revokeObjectURL(_o1c.src);
_o2o({ mime: 'image/jpeg', b64: url.split(',')[1] });
};
_o1c.onerror = () => rej(new Error('Không đọc được ảnh ' + file.name));
_o1c.src = URL.createObjectURL(file);
});
}
export default {
manifest: {
id: 'video', title: 'Video', icon: '🎬', screen: 'content', order: 10, version: '1.0.0', status: 'ready',
help: 'Dựng video trên máy tính: video bản đồ/quy hoạch (soạn kịch bản trong app bằng Gemini/Claude/Ollama, duyệt dàn cảnh có nguồn từng số, lưu Drive + gửi điện thoại) và video nhân vật đi trong căn (clip Flow/Veo). App không tự đăng.',
},
mount,
async selftest() {
const details = [];
try {
const _o1y = V.buildFlowPlan({ scenes: 3 });
if (_o1y.scenes.length !== 3 || !/9:16/.test(_o1y.scenes[0].prompt)) details.push('Lời nhắn Flow sai');
if (!V.validateMapCfg('{"items":[],"scenes":[{"dur":3}]}').ok) details.push('Kiểm tra cfg.json sai');
const _o1t = VS.parseOutline('{"scenes":[{"kind":"hook","title":"A","narration":["Cầu dài 4,8 km."],"figures":[{"value":"4,8 km"}]}]}');
if (!_o1t || VS.checkOutline(_o1t).ok) details.push('Kiểm dàn cảnh sai (số thiếu nguồn phải bị chặn)');
} catch (e) { details.push('Lỗi: ' + (e && e.message)); }
return { ok: !details.length, details: details.length ? details : ['Video: logic OK (máy dựng kiểm tra riêng khi mở màn)'] };
},
};

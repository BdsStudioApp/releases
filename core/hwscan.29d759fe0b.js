import { ensureCss } from './xkit.e7637ba4a6.js';
import { addWords, has } from './i18n.c64f4bc3eb.js';
export const FLAG_KEY = 'bds:flag:hwscan';
export const TIER_TONE = { co_ban: 'neutral', kha: 'info', manh: 'ok' };
export const TIER_LABEL = { co_ban: 'Cơ bản', kha: 'Khá', manh: 'Mạnh' };
export function hwEnabled(config, storage = globalThis.localStorage) {
const _o2 = (config && (config.hwscan || config.HWSCAN)) || {};
if (_o2.enabled === true) return true;
try { return !!storage && storage.getItem(FLAG_KEY) === '1'; } catch { return false; }
}
export function vn(x, digits = 1) {
const _ob = Number(x);
if (!Number.isFinite(_ob)) return '—';
return String(Math.round(_ob * 10 ** digits) / 10 ** digits).replace('.', ',');
}
export function gpuText(g) {
if (!g) return '';
if (g.unified) return `${g.name} · bộ nhớ chung ${vn(g.vram_gb)} GB` + (g.gpu_cores ? ` · ${g.gpu_cores} nhân GPU` : '');
return g.name + (g.vram_gb ? ` · ${vn(g.vram_gb)} GB VRAM` : '');
}
export function benchText(b) {
if (!b) return 'Chưa đo – bấm "Quét lại máy"';
if (b.skipped || !b.ok) return b.reason || 'Chưa đo được';
let _oj = `${b.seconds_video} giây video 1080p dựng trong ${vn(b.wall_s)} giây (${vn(b.speed_x)}× thời gian thực)`;
if (b.encode_60s_1080p_min != null) _oj += ` · mã hoá 60 giây video ≈ ${vn(b.encode_60s_1080p_min)} phút`;
if (b.from_previous) _oj += ' · số đo lần trước';
return _oj;
}
export function specRows(_ok) {
const cpu = _ok.cpu || {};
const cores = cpu.perf_cores ? `${cpu.cores} nhân (${cpu.perf_cores} nhân hiệu năng)` : `${cpu.cores || '?'} nhân`;
const gpus = (_ok.gpus || []).map(gpuText).filter(Boolean);
return [
['Chip / CPU', `${cpu.model || '?'} · ${cores}`],
['RAM', `${vn(_ok.ram_gb)} GB`],
['Card đồ hoạ', gpus.length ? gpus.join(' / ') : 'Không thấy card rời (dùng CPU)'],
['Ổ trống', `${vn(_ok.free_disk_gb)} GB`],
['Hệ điều hành', (_ok.os && _ok.os.label) || '—'],
['Đo thử', benchText(_ok.bench)]
];
}
export function splitRecs(_ok) {
const _o0 = Array.isArray(_ok && _ok.recommendations) ? _ok.recommendations : [];
return { shown: _o0.filter((_oh) => _oh && _oh.show), hidden: _o0.filter((_oh) => _oh && !_oh.show).length };
}
export function reportLine(rep) {
if (!rep || !rep.present) return { tone: 'neutral', text: 'Chưa có báo cáo bộ cài (máy dựng chạy từ mã nguồn hoặc bộ cài bản cũ).' };
if (rep.result === 'ok') return { tone: 'ok', text: rep.summary || 'Đã cài xong Máy dựng video.' };
if (rep.result === 'failed') return { tone: 'bad', text: rep.summary || 'Cài chưa xong – chạy lại bộ cài.' };
return { tone: 'warn', text: rep.summary || 'Cài chưa trọn – chạy lại bộ cài.' };
}
export function videoLine(mode) {
if (!mode || !mode.label) return null;
const _ol = { installer: 'chọn lúc cài', app: 'đổi trong app', env: 'đặt sẵn khi cài' }[mode.source] || '';
const pk = mode.pack || {};
const pack = pk.installed ? 'đã cài' : pk.wanted === false ? 'chưa cài – tuỳ chọn' : 'chưa cài';
return {
tone: mode.fallback ? 'warn' : 'neutral',
text: `${mode.label}${mode.chosen ? (_ol ? ' (' + _ol + ')' : '') : ' (mặc định)'} · Bộ công cụ dựng video: ${pack}`
+ (mode.fallback && mode.fallback.reason ? ' · ⚠ ' + mode.fallback.reason : '')
};
}
export function launchLine(info) {
if (!info || !info.origin) return null;
const _or = info.target === 'web';
const text = (_or ? 'Địa chỉ app riêng của anh/chị ' : 'Bản tại máy ') + info.origin + '/' + (info.saved ? '' : ' (chưa mở lần nào)');
const other = info.web_origin ? (_or ? { target: 'may', label: 'Đổi sang bản tại máy (127.0.0.1)' } : { target: 'web', label: 'Đổi sang app riêng ' + info.web_origin }) : null;
return { text, other };
}
export const HOW_LABEL = { pinned: 'tự ghim lần đầu', paired: 'đã ghép nối bằng mã', user: 'anh/chị thêm', cli: 'thêm bằng dòng lệnh' };
export function originsView(info, current = '') {
if (!info || !Array.isArray(info.origins)) return null;
const rows = info.origins.map((x) => ({ origin: x.origin, how: HOW_LABEL[x.how] || x.how || '', primary: x.origin === info.primary, current: x.origin === current }));
const trusted = rows.some((_oh) => _oh.current);
const note = !rows.length ? (info.auto_pin ? 'Chưa có địa chỉ nào – máy dựng sẽ tự tin địa chỉ app riêng ĐẦU TIÊN gọi tới (dạng <tên>.' + String(info.suffix || '').replace(/^\./, '') + ').'
: info.pairing ? 'Chưa có địa chỉ app nào được tin – ghép nối app với máy dựng bằng mã 6 số (nút "Ghép nối máy dựng").' : 'Chưa có địa chỉ app nào được tin.')
: trusted ? '' : 'Địa chỉ đang mở (' + current + ') CHƯA được máy dựng tin – app ở đây không dùng được máy dựng. Mở app ở địa chỉ đã tin để thêm.';
return { rows, canAdd: trusted && rows.length < (Number(info.max) || 10), trusted, note };
}
function _os(ms) {
if (!ms) return '';
try { return new Date(ms).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }); } catch { return ''; }
}
async function _o7(base, path, { method = 'GET', body, timeout = 4000, fetchFn = globalThis.fetch } = {}) {
const _o3 = new AbortController(); const _on = setTimeout(() => _o3.abort(), timeout);
try {
const _oh = await fetchFn(base + path, {
method, signal: _o3.signal,
...(body !== undefined ? { body: JSON.stringify(body), headers: { 'Content-Type': 'text/plain;charset=utf-8' } } : {})
});
const _o5 = await _oh.json().catch(() => ({}));
if (!_oh.ok || _o5.ok === false) {
const e = new Error((_o5.error && _o5.error.message) || 'Máy dựng trả lỗi ' + _oh.status); e.code = _o5.error && _o5.error.code; e.status = _oh.status; throw e;
}
return _o5;
} finally { clearTimeout(_on); }
}
export const HELP_TEXT = 'Máy dựng đo cấu hình máy tính này (chip, RAM, card đồ hoạ, ổ trống) và dựng thử 10 giây video để xếp hạng '
+ 'Cơ bản / Khá / Mạnh. App chỉ gợi ý những phần máy chạy được; phần nặng như Video AI trên máy chỉ hiện với máy hạng Mạnh.';
export function hwSection(ctx, app) {
if (!has('help.hw')) addWords({ 'help.hw': HELP_TEXT });
return ['hw', 'chip', 'Máy của tôi', (body) => renderHw(body, ctx, app)];
}
export async function renderHw(body, ctx, app, { fetchFn } = {}) {
ensureCss(new URL('./hwscan.99ba264f8d.css', import.meta.url).href, 'bds-hwscan-css');
const { ui } = ctx;
const { h, button, badge, kv, status } = ui;
const base = (app && app.config && app.config.ENGINE_URL) || 'http://127.0.0.1:8765';
const opts = fetchFn ? { fetchFn } : {};
const _o1 = h('div', { class: 'hw', 'data-testid': 'hw-card' });
body.appendChild(_o1);
await _oa(false);
async function _oa(fresh) {
ui.mountTo(_o1, h('p', { class: 'muted' }, ui.spinner(), ' Đang đọc cấu hình máy…'));
let _ok, rep = null;
try {
_ok = fresh ? await _o7(base, '/hw/scan', { method: 'POST', body: { bench: true }, timeout: 120000, ...opts })
: await _o7(base, '/hw/scan', { timeout: 30000, ...opts });
} catch (e) {
return _od(e);
}
try { rep = await _o7(base, '/install/report', opts); } catch { rep = null; }
let vmode = null, launchInfo = null;
try { vmode = (await _o7(base, '/videoai/status', opts)).mode || null; } catch { vmode = null; }
try { launchInfo = await _o7(base, '/install/launch', opts); } catch { launchInfo = null; }
let origins = null;
try { origins = await _o7(base, '/install/origins', opts); } catch { origins = null; }
_o6(_ok, rep, fresh, vmode, launchInfo, origins);
}
async function _od(e) {
const _oc = !e || e.name === 'AbortError' || e.name === 'TypeError' || !e.status;
if (_oc) {
const _o8 = await import('./engine_pair.1fc01ffec5.js');
const _om = await _o8.pairStatus(base, opts);
if (_om.running && !_om.trusted) {
return ui.mountTo(_o1, _o8.pairBox({ h, button: ui.button, toast: ui.toast, icon: ui.icon }, base, { ...opts, onPaired: () => _oa(false) }),
h('div', { class: 'btn-row' }, ui.button('Thử lại', () => _oa(false), { kind: 'secondary', icon: 'refresh', testid: 'hw-retry' })));
}
}
let _og = null;
if (_oc) { try { _og = (await import('./wizard/hwcheck.js')).hwCheckPanel(ui, { auto: true }); } catch { _og = null; } }
ui.mountTo(_o1,
h('p', { 'data-testid': 'hw-offline' }, _oc
? 'Chưa kết nối được máy dựng trên máy này. Bấm đúp "BDS Studio" trên màn hình nền (hoặc chạy bộ cài nếu chưa cài) rồi bấm Thử lại.'
: e.status === 404 ? 'Máy dựng trên máy này là bản cũ, chưa có chức năng quét máy – cập nhật máy dựng (Cài đặt → Phiên bản) rồi bấm Thử lại.'
: (e.message || 'Máy dựng trả lỗi.')),
h('div', { class: 'btn-row' }, button('Thử lại', () => _oa(false), { kind: 'secondary', icon: 'refresh', testid: 'hw-retry' })),
_oc ? h('h4', { class: 'section-title' }, 'Ước tính nhanh từ trình duyệt') : null,
_og);
}
function _oe(info) {
const _o4 = typeof location !== 'undefined' ? location.origin : '';
const _oo = originsView(info, _o4);
if (!_oo) return null;
const _of = async (body, ok) => {
try { await _o7(base, '/install/origins', { method: 'POST', body, ...opts }); ui.toast(ok, 'success', 3000); await _oa(false); }
catch (e) { ui.toast(e.code === 'ORIGIN_DENIED' ? 'Chỉ đổi được từ app đã được máy dựng tin.' : (e.message || 'Chưa đổi được'), 'error', 6000); }
};
const inp = h('input', { type: 'url', placeholder: 'https://app.tencuaban.com', autocomplete: 'off', 'data-testid': 'hw-origin-input', 'aria-label': 'Địa chỉ app cần thêm' });
return h('div', { class: 'hw-origins', 'data-testid': 'hw-origins' },
h('h4', { class: 'section-title' }, 'Địa chỉ app được máy dựng tin'),
h('p', { class: 'muted small' }, 'Máy dựng chỉ nhận lệnh từ đúng các địa chỉ app riêng dưới đây (so khớp chính xác).'),
_oo.rows.length ? h('ul', { class: 'hw-recs' }, _oo.rows.map((_oh) => h('li', { dataset: { origin: _oh.origin } },
h('div', null, h('strong', null, _oh.origin), ' ', _oh.primary ? badge('chính', 'ok') : null, _oh.current ? badge('đang mở', 'neutral') : null,
h('p', { class: 'muted small' }, _oh.how)),
_oo.trusted && !_oh.primary ? button('Đặt làm chính', () => _of({ primary: _oh.origin }, 'Đã đặt ' + _oh.origin + ' làm địa chỉ chính'), { kind: 'ghost', small: true }) : null,
_oo.trusted && !_oh.current ? button('Bỏ', () => _of({ remove: _oh.origin }, 'Đã bỏ ' + _oh.origin), { kind: 'ghost', small: true }) : null))) : null,
_oo.note ? h('p', { class: 'muted small', 'data-testid': 'hw-origins-note' }, _oo.note) : null,
_oo.canAdd ? h('div', { class: 'btn-row' }, inp, button('Thêm địa chỉ', () => {
const _op = String(inp.value || '').trim().replace(/\/+$/, '');
if (!/^https:\/\/[a-z0-9.-]+(:\d+)?$/i.test(_op)) { ui.toast('Gõ địa chỉ dạng https://app.tencuaban.com', 'warn'); return; }
return _of({ add: _op }, 'Đã thêm ' + _op);
}, { kind: 'secondary', small: true, testid: 'hw-origin-add' })) : null);
}
function _o6(_ok, rep, fresh, vmode, launchInfo, origins) {
const tier = _ok.tier || 'co_ban';
const { shown, hidden } = splitRecs(_ok);
const _oi = reportLine(rep);
const _oq = videoLine(vmode);
const _o9 = launchLine(launchInfo);
const head = h('div', { class: 'hw-head' },
h('div', { class: 'hw-tier', 'data-testid': 'hw-tier', dataset: { tier } },
h('span', { class: 'muted small' }, 'Hạng máy'),
h('strong', null, _ok.tier_label || TIER_LABEL[tier] || tier)),
h('div', { class: 'hw-head-text' },
badge(_ok.tier_label || TIER_LABEL[tier] || tier, TIER_TONE[tier] || 'neutral'),
h('p', { class: 'muted small' }, (fresh ? 'Vừa quét' : 'Quét lúc ' + _os(_ok.at)) + (_ok.cached === false && !fresh ? ' (vừa quét nhanh, chưa đo thử)' : ''))));
const reasons = (_ok.reasons || []).length
? h('ul', { class: 'hw-reasons muted small', 'data-testid': 'hw-reasons' }, _ok.reasons.map((_oh) => h('li', null, _oh))) : null;
const recList = h('ul', { class: 'hw-recs', 'data-testid': 'hw-recs' },
shown.map((_oh) => h('li', { dataset: { rec: _oh.id } }, status(true), h('div', null, h('strong', null, _oh.title), h('p', { class: 'muted small' }, _oh.reason)))));
ui.mountTo(_o1,
head,
kv(specRows(_ok)),
reasons,
h('h4', { class: 'section-title' }, 'Nên dùng trên máy này'),
recList,
hidden ? h('p', { class: 'muted small', 'data-testid': 'hw-hidden' }, `${hidden} lựa chọn nặng (AI/Video AI chạy trên máy) đang ẩn vì máy chưa đủ mạnh.`) : null,
h('p', { class: 'hw-report hw-report-' + _oi.tone, 'data-testid': 'hw-report' }, h('span', { class: 'muted small' }, 'Bộ cài: '), _oi.text),
_oq ? h('p', { class: 'hw-report hw-report-' + _oq.tone, 'data-testid': 'hw-video' }, h('span', { class: 'muted small' }, 'Xử lý video: '), _oq.text,
h('span', { class: 'muted small' }, ' – đổi ở Video AI › AI trên máy')) : null,
_o9 ? h('p', { class: 'hw-report hw-report-neutral', 'data-testid': 'hw-launch' }, h('span', { class: 'muted small' }, 'Biểu tượng BDS Studio mở: '), _o9.text) : null,
_o9 && _o9.other ? h('div', { class: 'btn-row' }, button(_o9.other.label, async () => {
try { await _o7(base, '/install/launch', { method: 'POST', body: { target: _o9.other.target }, ...opts }); ui.toast('Đã đổi – lần sau bấm biểu tượng BDS Studio sẽ mở nơi mới', 'success', 4000); await _oa(false); }
catch (e) { ui.toast(e.message || 'Chưa đổi được', 'error'); }
}, { kind: 'secondary', testid: 'hw-launch-switch' })) : null,
_oe(origins),
h('div', { class: 'btn-row' },
button('Quét lại máy', async () => {
ui.toast('Đang quét máy và đo thử dựng 10 giây video…', 'info', 4000);
await _oa(true);
}, { kind: 'primary', icon: 'refresh', testid: 'hw-rescan' })),
h('p', { class: 'muted small' }, 'Số đo thật trên máy này (không đoán). Phần mở rộng nặng chỉ hiện khi máy đủ hạng.'));
}
}
export default { hwEnabled, hwSection, renderHw, specRows, splitRecs, reportLine, videoLine, launchLine, originsView, benchText, gpuText, vn };

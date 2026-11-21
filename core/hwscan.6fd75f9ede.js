import { ensureCss } from './xkit.71d637c634.js';
import { addWords, has } from './i18n.17f01a0b54.js';
export const FLAG_KEY = 'bds:flag:hwscan';
export const TIER_TONE = { co_ban: 'neutral', kha: 'info', manh: 'ok' };
export const TIER_LABEL = { co_ban: 'Cơ bản', kha: 'Khá', manh: 'Mạnh' };
export function hwEnabled(config, storage = globalThis.localStorage) {
const _o1 = (config && (config.hwscan || config.HWSCAN)) || {};
if (_o1.enabled === true) return true;
try { return !!storage && storage.getItem(FLAG_KEY) === '1'; } catch { return false; }
}
export function vn(x, digits = 1) {
const _oa = Number(x);
if (!Number.isFinite(_oa)) return '—';
return String(Math.round(_oa * 10 ** digits) / 10 ** digits).replace('.', ',');
}
export function gpuText(g) {
if (!g) return '';
if (g.unified) return `${g.name} · bộ nhớ chung ${vn(g.vram_gb)} GB` + (g.gpu_cores ? ` · ${g.gpu_cores} nhân GPU` : '');
return g.name + (g.vram_gb ? ` · ${vn(g.vram_gb)} GB VRAM` : '');
}
export function benchText(b) {
if (!b) return 'Chưa đo – bấm "Quét lại máy"';
if (b.skipped || !b.ok) return b.reason || 'Chưa đo được';
let _oi = `${b.seconds_video} giây video 1080p dựng trong ${vn(b.wall_s)} giây (${vn(b.speed_x)}× thời gian thực)`;
if (b.encode_60s_1080p_min != null) _oi += ` · mã hoá 60 giây video ≈ ${vn(b.encode_60s_1080p_min)} phút`;
if (b.from_previous) _oi += ' · số đo lần trước';
return _oi;
}
export function specRows(_oj) {
const cpu = _oj.cpu || {};
const cores = cpu.perf_cores ? `${cpu.cores} nhân (${cpu.perf_cores} nhân hiệu năng)` : `${cpu.cores || '?'} nhân`;
const gpus = (_oj.gpus || []).map(gpuText).filter(Boolean);
return [
['Chip / CPU', `${cpu.model || '?'} · ${cores}`],
['RAM', `${vn(_oj.ram_gb)} GB`],
['Card đồ hoạ', gpus.length ? gpus.join(' / ') : 'Không thấy card rời (dùng CPU)'],
['Ổ trống', `${vn(_oj.free_disk_gb)} GB`],
['Hệ điều hành', (_oj.os && _oj.os.label) || '—'],
['Đo thử', benchText(_oj.bench)]
];
}
export function splitRecs(_oj) {
const _o0 = Array.isArray(_oj && _oj.recommendations) ? _oj.recommendations : [];
return { shown: _o0.filter((_og) => _og && _og.show), hidden: _o0.filter((_og) => _og && !_og.show).length };
}
export function reportLine(rep) {
if (!rep || !rep.present) return { tone: 'neutral', text: 'Chưa có báo cáo bộ cài (máy dựng chạy từ mã nguồn hoặc bộ cài bản cũ).' };
if (rep.result === 'ok') return { tone: 'ok', text: rep.summary || 'Đã cài xong Máy dựng video.' };
if (rep.result === 'failed') return { tone: 'bad', text: rep.summary || 'Cài chưa xong – chạy lại bộ cài.' };
return { tone: 'warn', text: rep.summary || 'Cài chưa trọn – chạy lại bộ cài.' };
}
export function videoLine(mode) {
if (!mode || !mode.label) return null;
const _ok = { installer: 'chọn lúc cài', app: 'đổi trong app', env: 'đặt sẵn khi cài' }[mode.source] || '';
const pk = mode.pack || {};
const pack = pk.installed ? 'đã cài' : pk.wanted === false ? 'chưa cài – tuỳ chọn' : 'chưa cài';
return {
tone: mode.fallback ? 'warn' : 'neutral',
text: `${mode.label}${mode.chosen ? (_ok ? ' (' + _ok + ')' : '') : ' (mặc định)'} · Bộ công cụ dựng video: ${pack}`
+ (mode.fallback && mode.fallback.reason ? ' · ⚠ ' + mode.fallback.reason : '')
};
}
export function launchLine(info) {
if (!info || !info.origin) return null;
const _oq = info.target === 'web';
const text = (_oq ? 'Địa chỉ app riêng của anh/chị ' : 'Bản tại máy ') + info.origin + '/' + (info.saved ? '' : ' (chưa mở lần nào)');
const other = info.web_origin ? (_oq ? { target: 'may', label: 'Đổi sang bản tại máy (127.0.0.1)' } : { target: 'web', label: 'Đổi sang app riêng ' + info.web_origin }) : null;
return { text, other };
}
export const HOW_LABEL = { pinned: 'tự ghim lần đầu', paired: 'đã ghép nối bằng mã', user: 'anh/chị thêm', cli: 'thêm bằng dòng lệnh' };
export function originsView(info, current = '') {
if (!info || !Array.isArray(info.origins)) return null;
const rows = info.origins.map((x) => ({ origin: x.origin, how: HOW_LABEL[x.how] || x.how || '', primary: x.origin === info.primary, current: x.origin === current }));
const trusted = rows.some((_og) => _og.current);
const note = !rows.length ? (info.auto_pin ? 'Chưa có địa chỉ nào – máy dựng sẽ tự tin địa chỉ app riêng ĐẦU TIÊN gọi tới (dạng <tên>.' + String(info.suffix || '').replace(/^\./, '') + ').'
: info.pairing ? 'Chưa có địa chỉ app nào được tin – ghép nối app với máy dựng bằng mã 6 số (nút "Ghép nối máy dựng").' : 'Chưa có địa chỉ app nào được tin.')
: trusted ? '' : 'Địa chỉ đang mở (' + current + ') CHƯA được máy dựng tin – app ở đây không dùng được máy dựng. Mở app ở địa chỉ đã tin để thêm.';
return { rows, canAdd: trusted && rows.length < (Number(info.max) || 10), trusted, note };
}
function _or(ms) {
if (!ms) return '';
try { return new Date(ms).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }); } catch { return ''; }
}
async function _o6(base, path, { method = 'GET', body, timeout = 4000, fetchFn = globalThis.fetch } = {}) {
const _o2 = new AbortController(); const _om = setTimeout(() => _o2.abort(), timeout);
try {
const _og = await fetchFn(base + path, {
method, signal: _o2.signal,
...(body !== undefined ? { body: JSON.stringify(body), headers: { 'Content-Type': 'text/plain;charset=utf-8' } } : {})
});
const _o4 = await _og.json().catch(() => ({}));
if (!_og.ok || _o4.ok === false) {
const e = new Error((_o4.error && _o4.error.message) || 'Máy dựng trả lỗi ' + _og.status); e.code = _o4.error && _o4.error.code; e.status = _og.status; throw e;
}
return _o4;
} finally { clearTimeout(_om); }
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
const box = h('div', { class: 'hw', 'data-testid': 'hw-card' });
body.appendChild(box);
await _o9(false);
async function _o9(fresh) {
ui.mountTo(box, h('p', { class: 'muted' }, ui.spinner(), ' Đang đọc cấu hình máy…'));
let _oj, rep = null;
try {
_oj = fresh ? await _o6(base, '/hw/scan', { method: 'POST', body: { bench: true }, timeout: 120000, ...opts })
: await _o6(base, '/hw/scan', { timeout: 30000, ...opts });
} catch (e) {
return _oc(e);
}
try { rep = await _o6(base, '/install/report', opts); } catch { rep = null; }
let vmode = null, launchInfo = null;
try { vmode = (await _o6(base, '/videoai/status', opts)).mode || null; } catch { vmode = null; }
try { launchInfo = await _o6(base, '/install/launch', opts); } catch { launchInfo = null; }
let origins = null;
try { origins = await _o6(base, '/install/origins', opts); } catch { origins = null; }
_o5(_oj, rep, fresh, vmode, launchInfo, origins);
}
async function _oc(e) {
const _ob = !e || e.name === 'AbortError' || e.name === 'TypeError' || !e.status;
if (_ob) {
const _o7 = await import('./engine_pair.1fc01ffec5.js');
const _ol = await _o7.pairStatus(base, opts);
if (_ol.running && !_ol.trusted) {
return ui.mountTo(box, _o7.pairBox({ h, button: ui.button, toast: ui.toast, icon: ui.icon }, base, { ...opts, onPaired: () => _o9(false) }),
h('div', { class: 'btn-row' }, ui.button('Thử lại', () => _o9(false), { kind: 'secondary', icon: 'refresh', testid: 'hw-retry' })));
}
}
let _of = null;
if (_ob) { try { _of = (await import('./wizard/hwcheck.js')).hwCheckPanel(ui, { auto: true }); } catch { _of = null; } }
ui.mountTo(box,
h('p', { 'data-testid': 'hw-offline' }, _ob
? 'Chưa kết nối được máy dựng trên máy này. Bấm đúp "BDS Studio" trên màn hình nền (hoặc chạy bộ cài nếu chưa cài) rồi bấm Thử lại.'
: e.status === 404 ? 'Máy dựng trên máy này là bản cũ, chưa có chức năng quét máy – cập nhật máy dựng (Cài đặt → Phiên bản) rồi bấm Thử lại.'
: (e.message || 'Máy dựng trả lỗi.')),
h('div', { class: 'btn-row' }, button('Thử lại', () => _o9(false), { kind: 'secondary', icon: 'refresh', testid: 'hw-retry' })),
_ob ? h('h4', { class: 'section-title' }, 'Ước tính nhanh từ trình duyệt') : null,
_of);
}
function _od(info) {
const _o3 = typeof location !== 'undefined' ? location.origin : '';
const _on = originsView(info, _o3);
if (!_on) return null;
const _oe = async (body, ok) => {
try { await _o6(base, '/install/origins', { method: 'POST', body, ...opts }); ui.toast(ok, 'success', 3000); await _o9(false); }
catch (e) { ui.toast(e.code === 'ORIGIN_DENIED' ? 'Chỉ đổi được từ app đã được máy dựng tin.' : (e.message || 'Chưa đổi được'), 'error', 6000); }
};
const inp = h('input', { type: 'url', placeholder: 'https://app.tencuaban.com', autocomplete: 'off', 'data-testid': 'hw-origin-input', 'aria-label': 'Địa chỉ app cần thêm' });
return h('div', { class: 'hw-origins', 'data-testid': 'hw-origins' },
h('h4', { class: 'section-title' }, 'Địa chỉ app được máy dựng tin'),
h('p', { class: 'muted small' }, 'Máy dựng chỉ nhận lệnh từ đúng các địa chỉ app riêng dưới đây (so khớp chính xác).'),
_on.rows.length ? h('ul', { class: 'hw-recs' }, _on.rows.map((_og) => h('li', { dataset: { origin: _og.origin } },
h('div', null, h('strong', null, _og.origin), ' ', _og.primary ? badge('chính', 'ok') : null, _og.current ? badge('đang mở', 'neutral') : null,
h('p', { class: 'muted small' }, _og.how)),
_on.trusted && !_og.primary ? button('Đặt làm chính', () => _oe({ primary: _og.origin }, 'Đã đặt ' + _og.origin + ' làm địa chỉ chính'), { kind: 'ghost', small: true }) : null,
_on.trusted && !_og.current ? button('Bỏ', () => _oe({ remove: _og.origin }, 'Đã bỏ ' + _og.origin), { kind: 'ghost', small: true }) : null))) : null,
_on.note ? h('p', { class: 'muted small', 'data-testid': 'hw-origins-note' }, _on.note) : null,
_on.canAdd ? h('div', { class: 'btn-row' }, inp, button('Thêm địa chỉ', () => {
const _oo = String(inp.value || '').trim().replace(/\/+$/, '');
if (!/^https:\/\/[a-z0-9.-]+(:\d+)?$/i.test(_oo)) { ui.toast('Gõ địa chỉ dạng https://app.tencuaban.com', 'warn'); return; }
return _oe({ add: _oo }, 'Đã thêm ' + _oo);
}, { kind: 'secondary', small: true, testid: 'hw-origin-add' })) : null);
}
function _o5(_oj, rep, fresh, vmode, launchInfo, origins) {
const tier = _oj.tier || 'co_ban';
const { shown, hidden } = splitRecs(_oj);
const _oh = reportLine(rep);
const _op = videoLine(vmode);
const _o8 = launchLine(launchInfo);
const head = h('div', { class: 'hw-head' },
h('div', { class: 'hw-tier', 'data-testid': 'hw-tier', dataset: { tier } },
h('span', { class: 'muted small' }, 'Hạng máy'),
h('strong', null, _oj.tier_label || TIER_LABEL[tier] || tier)),
h('div', { class: 'hw-head-text' },
badge(_oj.tier_label || TIER_LABEL[tier] || tier, TIER_TONE[tier] || 'neutral'),
h('p', { class: 'muted small' }, (fresh ? 'Vừa quét' : 'Quét lúc ' + _or(_oj.at)) + (_oj.cached === false && !fresh ? ' (vừa quét nhanh, chưa đo thử)' : ''))));
const reasons = (_oj.reasons || []).length
? h('ul', { class: 'hw-reasons muted small', 'data-testid': 'hw-reasons' }, _oj.reasons.map((_og) => h('li', null, _og))) : null;
const recList = h('ul', { class: 'hw-recs', 'data-testid': 'hw-recs' },
shown.map((_og) => h('li', { dataset: { rec: _og.id } }, status(true), h('div', null, h('strong', null, _og.title), h('p', { class: 'muted small' }, _og.reason)))));
ui.mountTo(box,
head,
kv(specRows(_oj)),
reasons,
h('h4', { class: 'section-title' }, 'Nên dùng trên máy này'),
recList,
hidden ? h('p', { class: 'muted small', 'data-testid': 'hw-hidden' }, `${hidden} lựa chọn nặng (AI/Video AI chạy trên máy) đang ẩn vì máy chưa đủ mạnh.`) : null,
h('p', { class: 'hw-report hw-report-' + _oh.tone, 'data-testid': 'hw-report' }, h('span', { class: 'muted small' }, 'Bộ cài: '), _oh.text),
_op ? h('p', { class: 'hw-report hw-report-' + _op.tone, 'data-testid': 'hw-video' }, h('span', { class: 'muted small' }, 'Xử lý video: '), _op.text,
h('span', { class: 'muted small' }, ' – đổi ở Video AI › AI trên máy')) : null,
_o8 ? h('p', { class: 'hw-report hw-report-neutral', 'data-testid': 'hw-launch' }, h('span', { class: 'muted small' }, 'Biểu tượng BDS Studio mở: '), _o8.text) : null,
_o8 && _o8.other ? h('div', { class: 'btn-row' }, button(_o8.other.label, async () => {
try { await _o6(base, '/install/launch', { method: 'POST', body: { target: _o8.other.target }, ...opts }); ui.toast('Đã đổi – lần sau bấm biểu tượng BDS Studio sẽ mở nơi mới', 'success', 4000); await _o9(false); }
catch (e) { ui.toast(e.message || 'Chưa đổi được', 'error'); }
}, { kind: 'secondary', testid: 'hw-launch-switch' })) : null,
_od(origins),
h('div', { class: 'btn-row' },
button('Quét lại máy', async () => {
ui.toast('Đang quét máy và đo thử dựng 10 giây video…', 'info', 4000);
await _o9(true);
}, { kind: 'primary', icon: 'refresh', testid: 'hw-rescan' })),
h('p', { class: 'muted small' }, 'Số đo thật trên máy này (không đoán). Phần mở rộng nặng chỉ hiện khi máy đủ hạng.'));
}
}
export default { hwEnabled, hwSection, renderHw, specRows, splitRecs, reportLine, videoLine, launchLine, originsView, benchText, gpuText, vn };

import { kit, h } from '../_lib/kit.js';
import * as V from '../_lib/video.js';
import * as L from './logic.js';
const _o2 = 'bds.videoai.provider';
const _o4 = 4000;
const _o1x = (u) => { const _o1w = String(u || '').trim(); try { const _o27 = new URL(_o1w); return _o27.protocol === 'https:' || _o27.protocol === 'http:' ? _o27.href : null; } catch { return null; } };
const ls = (k, v) => { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch { } return null; };
export async function mount(el, ctx) {
const _o1 = kit(ctx);
const base = (ctx.config && ctx.config.ENGINE_URL) || V.ENGINE_URL;
const online = () => { try { return !!(ctx.video && typeof ctx.video.online === 'function' && ctx.video.online()); } catch { return false; } };
const _o3 = online();
const _o0 = (path, opts = {}) => (online()
? Promise.reject(Object.assign(new Error('Đang chỉ dùng AI trên mạng – không dùng máy dựng trên máy này'), { code: 'ONLINE_MODE' }))
: V.engineCall(path, { base, ...opts }));
const role = (ctx.user && ctx.user.role) || 'owner';
const _o18 = role === 'owner';
const alive = () => el.isConnected;
const _o24 = { status: null, eng: null, draft: L.readDraft(localStorage), busy: false, chars: [], image: null, timers: [] };
el.innerHTML = '';
const head = h('div', { class: 'bds-row bds-wrap' }, _o1.badge('Thử nghiệm', 'warn'),
h('span', { class: 'bds-muted' }, 'AI tạo cảnh đẹp hơn rồi ghép vào video máy dựng. Cảnh bản đồ, số liệu vẫn do máy dựng làm.'));
const _o20 = h('div', { 'data-testid': 'va-scenes' });
const genBody = h('div', { 'data-testid': 'va-gen' });
const _o17 = h('div', { 'data-testid': 'va-out' });
const _oe = h('div', { class: 'bds-list', 'data-testid': 'va-clips' });
const _o1e = h('div', { 'data-testid': 'va-prices' });
const _of = h('div', { 'data-testid': 'va-conf' });
const _o16 = h('div', { 'data-testid': 'va-offline' });
const topNote = h('div');
const onlineHead = h('div', { class: 'bds-note', 'data-testid': 'va-online' },
h('p', null, h('b', null, 'Chỉ dùng AI trên mạng – không cài gì'), ' ', _o1.badge('thu phí theo nhà cung cấp', 'warn')),
h('p', { class: 'bds-muted' }, 'Tạo clip ngắn minh hoạ ở Video › "Làm bằng AI trên mạng ngay" – app hỏi chi phí trước mỗi lần. ' + (_o18 ? 'Ở đây: nhập bảng giá và khoá nhà cung cấp (Runway – có Veo, Kling).' : 'Quản trị (Admin) nhập bảng giá và khoá nhà cung cấp.')),
h('div', { class: 'bds-row bds-wrap' }, _o1.button('Mở Video › Làm bằng AI', () => _o1.nav('content/video'), { kind: 'primary', icon: 'sparkle', testid: 'va-online-open' })));
el.appendChild(_o3 ? h('div', { class: 'bds-stack', 'data-testid': 'videoai-screen', 'data-mode': 'online' }, onlineHead,
_o1.card({ title: 'Bảng giá (tự nhập – app không ghi sẵn giá)', body: _o1e, testid: 'va-card-prices' }),
_o18 ? _o1.card({ title: 'Cài đặt gói Video AI', body: _of, testid: 'va-card-conf' }) : null) : h('div', { class: 'bds-stack', 'data-testid': 'videoai-screen' }, head, topNote,
_o1.card({ title: '1. Video đang soạn', body: _o20, testid: 'va-card-scenes' }),
_o1.card({ title: '2. Tạo cảnh AI', body: h('div', null, genBody, _o17), testid: 'va-card-gen' }),
_o1.card({ title: 'Clip AI đã có', body: _oe, testid: 'va-card-clips' }),
_o1.card({ title: 'Bảng giá (tự nhập – app không ghi sẵn giá)', body: _o1e, testid: 'va-card-prices' }),
_o18 ? _o1.card({ title: 'Cài đặt gói Video AI', body: _of, testid: 'va-card-conf' }) : null,
_o1.card({ title: 'AI ngay trên máy', body: _o16, testid: 'va-card-offline' })));
async function _o11() {
try { _o24.status = await _o1.api('videoai.status', {}); } catch (e) { _o24.status = { error: e.message || String(e), providers: {}, prices: [] }; }
}
async function _o10() {
if (online()) { _o24.eng = null; return; }
try { _o24.eng = await _o0('/videoai/status', { timeout: 3000 }); } catch { _o24.eng = null; }
}
const prices = () => (_o24.status && _o24.status.prices && _o24.status.prices.length ? _o24.status.prices : []);
const _o14 = (_o19) => (_o24.status && _o24.status.providers && _o24.status.providers[_o19] && _o24.status.providers[_o19].model) || '';
function _o1t() {
_o24.draft = L.readDraft(localStorage);
_o20.innerHTML = '';
if (!_o24.draft.cfg) {
_o20.appendChild(h('p', { class: 'bds-muted', 'data-testid': 'va-no-cfg' }, 'Chưa có video đang soạn. Vào "Video" → Soạn kịch bản → Duyệt dàn cảnh (máy dựng tạo cfg.json), rồi quay lại đây thêm cảnh AI.'));
_o20.appendChild(_o1.button('Mở Video bản đồ', () => _o1.nav('content/video'), { testid: 'va-go-video' }));
return;
}
const list = L.sceneList(_o24.draft.cfg);
_o20.appendChild(h('p', { class: 'bds-muted' }, `${_o24.draft.cfg.title || 'Video'} · ${list.length} cảnh`));
_o20.appendChild(h('div', { class: 'bds-list' }, list.map((_o1w) => h('div', { class: 'bds-item', 'data-testid': 'va-scene-' + _o1w.i },
h('span', null, `${_o1w.n}. ${_o1w.title}`),
_o1w.type === 'ai' ? _o1.badge(_o1w.label ? 'Cảnh AI · ẢNH MINH HOẠ' : 'Cảnh AI', 'success') : _o1w.engine ? _o1.badge(_o1w.type === 'map' ? 'Bản đồ – máy dựng làm' : 'Số liệu – máy dựng làm', 'muted') : _o1.badge('Máy dựng', 'muted')))));
}
const _ox = _o1.select(L.KINDS.map((k) => [k.id, k.label]), 'presenter', { 'data-testid': 'va-kind' });
const _o6 = h('select', { 'data-testid': 'va-at' });
const subject = h('textarea', { rows: 2, 'data-testid': 'va-subject', placeholder: 'Cảnh cần tạo, vd: nhân vật giới thiệu tiện ích hồ bơi, nắng sớm' });
const setting = h('input', { type: 'text', 'data-testid': 'va-setting', placeholder: 'Bối cảnh (tuỳ chọn), vd: sảnh căn hộ cao cấp, Hà Nội' });
const charSel = h('select', { 'data-testid': 'va-char' });
const secSel = _o1.select([4, 5, 6, 8, 10].map((n) => [n, n + ' giây']), 8, { 'data-testid': 'va-seconds' });
const aspSel = _o1.select([['9:16', 'Dọc 9:16'], ['16:9', 'Ngang 16:9']], '9:16', { 'data-testid': 'va-aspect' });
const qualSel = _o1.select([['fast', 'Fast – bản nháp'], ['quality', 'Quality – bản cuối']], 'fast', { 'data-testid': 'va-quality' });
const subs = h('input', { type: 'text', 'data-testid': 'va-subs', placeholder: 'Lời đọc của cảnh (tuỳ chọn, hiện phụ đề)' });
const prompt = h('textarea', { rows: 6, 'data-testid': 'va-prompt', spellcheck: false, style: { fontFamily: 'ui-monospace,Menlo,monospace', fontSize: '13px' } });
const imgIn = h('input', { type: 'file', accept: 'image/jpeg,image/png,image/webp', 'data-testid': 'va-image', style: { maxWidth: '100%' } });
const _o1h = h('select', { 'data-testid': 'va-provider' });
const _o1g = h('p', { class: 'bds-muted', 'data-testid': 'va-provider-hint' });
const _oy = h('p', { class: 'bds-hint', 'data-testid': 'va-label-note' });
const _og = h('div', { class: 'bds-note', 'data-testid': 'va-cost' });
const _os = _o1.button('Tạo cảnh', () => _or(), { kind: 'primary', testid: 'va-generate' });
const _op = h('input', { type: 'file', accept: 'video/mp4,video/quicktime,video/webm', 'data-testid': 'va-flow-file', style: { maxWidth: '100%', display: 'block', marginTop: '6px' } });
const _oo = h('div', { 'data-testid': 'va-flow-box' });
let _o1f = false;
prompt.addEventListener('input', () => { _o1f = true; });
function _oh() { return _o24.chars.find((_o9) => _o9.id === charSel.value) || null; }
function _o1i() {
if (_o1f) return;
const _o19 = L.buildPrompt({ kind: _ox.value, subject: subject.value, setting: setting.value, character: _ox.value === 'presenter' ? _oh() : null, aspect: aspSel.value, seconds: Number(secSel.value) });
prompt.value = _o19.prompt; prompt.dataset.negative = _o19.negative;
}
function _o1k() {
const list = _o24.draft.cfg ? L.sceneList(_o24.draft.cfg) : [];
_o6.innerHTML = '';
list.forEach((_o1w) => _o6.appendChild(h('option', { value: _o1w.i }, `Trước cảnh ${_o1w.n}: ${_o1w.title}`)));
_o6.appendChild(h('option', { value: list.length, selected: true }, 'Cuối video'));
}
function _ol() {
const _o19 = _o1h.value;
const model = L.providerById(_o19).mode === 'api' ? _o14(_o19) : '';
return L.estimate(prices(), { provider: _o19, model, quality: _o19 === 'flow' ? qualSel.value : '', seconds: L.snapSeconds(_o19, Number(secSel.value), model), count: 1 });
}
function _o1s() {
const _o1z = ls(_o2) || 'flow';
_o1h.innerHTML = '';
const gate = _o24.eng && _o24.eng.gate;
for (const _o19 of L.visibleProviders()) {
const e = L.estimate(prices(), { provider: _o19.id, model: _o14(_o19.id), seconds: L.snapSeconds(_o19.id, Number(secSel.value), _o14(_o19.id)) });
const r = L.providerReady(_o19.id, { status: _o24.status, gate, engineOn: !!_o24.eng, est: _o19.mode === 'api' ? e : null, role });
if (_o19.id === 'local' && !(gate && gate.allowed)) continue;
_o1h.appendChild(h('option', { value: _o19.id, disabled: !r.ok, selected: _o19.id === _o1z && r.ok, title: r.why }, _o19.label + (r.ok ? '' : ' – ' + r.why)));
}
if (_o1h.selectedOptions[0] && _o1h.selectedOptions[0].disabled) _o1h.value = 'flow';
_o1n();
}
function _o1n() {
const _o19 = L.providerById(_o1h.value) || L.visibleProviders()[0];
_o1g.textContent = _o19.hint;
qualSel.parentElement && (qualSel.closest('label').style.display = _o19.id === 'flow' ? '' : 'none');
_oy.textContent = L.needsLabel(_ox.value) ? `Cảnh ${(L.KINDS.find((k) => k.id === _ox.value) || {}).label.toLowerCase()} sẽ ghi "${L.LABEL_TEXT}" trên hình.` : 'Cảnh này không gắn chữ "AI" trên hình (khi đăng, tự bật nhãn nội dung AI của nền tảng nếu cần).';
const e = _ol();
_og.innerHTML = '';
_og.appendChild(h('div', null, h('b', null, 'Chi phí ước tính: '), h('span', { 'data-testid': 'va-cost-text' }, L.costText(e))));
if (e.source_url) _og.appendChild(h('small', null, 'Nguồn giá: ', _o1x(e.source_url) ? h('a', { href: _o1x(e.source_url), target: '_blank', rel: 'noopener noreferrer' }, e.source_url) : e.source_url));
if (_o24.status && _o24.status.cap_video_usd !== undefined && _o19.mode === 'api') _og.appendChild(h('small', { class: 'bds-muted' }, ` · Trần mỗi video: ${_o24.status.cap_video_usd} USD`));
_os.textContent = _o19.id === 'flow' ? '📦 Đóng gói cho Flow' : _o19.id === 'local' ? '✨ Tạo trên máy' : '✨ Tạo cảnh';
_os.appendChild(_o1.aiBadge(_o19.id === 'local' ? 'videoai_local' : _o19.id === 'flow' ? { id: 'videoai_clip', provider: 'flow' } : { id: 'videoai_clip', provider: _o19.id, providerLabel: _o19.short }));
_og.appendChild(_o19.id === 'local' ? _o1.aiNote('videoai_local') : _o1.aiNote(_o19.id === 'flow' ? { id: 'videoai_clip', provider: 'flow' } : { id: 'videoai_clip', provider: _o19.id, providerLabel: _o19.short }));
_oo.style.display = _o19.id === 'flow' ? '' : 'none';
ls(_o2, _o19.id);
}
[_ox, subject, setting, charSel, secSel, aspSel].forEach((_o27) => _o27.addEventListener('input', () => { _o1i(); _o1n(); }));
[_ox, charSel, secSel, aspSel, qualSel, _o1h].forEach((_o27) => _o27.addEventListener('change', () => { _o1i(); _o1n(); }));
imgIn.addEventListener('change', async () => {
_o24.image = null;
const _om = imgIn.files && imgIn.files[0];
if (!_om) return;
if (_om.size > 5 * 1024 * 1024) { _o1.toast('Ảnh tham chiếu tối đa 5 MB', 'warn'); imgIn.value = ''; return; }
_o24.image = { name: _om.name, mime: _om.type || 'image/jpeg', b64: await _on(_om) };
});
_op.addEventListener('change', () => _ot());
function _o1o() {
genBody.innerHTML = '';
genBody.appendChild(h('div', { class: 'bds-grid2' },
_o1.field('Loại cảnh', _ox), _o1.field('Chèn vào', _o6),
_o1.field('Thời lượng', secSel), _o1.field('Khung hình', aspSel)));
genBody.appendChild(_oy);
genBody.appendChild(_o1.field('Mô tả cảnh', subject));
genBody.appendChild(_o1.field('Bối cảnh', setting));
genBody.appendChild(_o1.field('Nhân vật dẫn (thư viện nhân vật)', charSel, 'Chỉ dùng cho cảnh nhân vật dẫn – giữ đúng ngoại hình đã khoá.'));
genBody.appendChild(_o1.field('Ảnh tham chiếu (tuỳ chọn)', imgIn, 'Ảnh căn hộ / phối cảnh / nhân vật – AI bám theo ảnh này.'));
genBody.appendChild(_o1.field('Lời đọc', subs));
genBody.appendChild(h('details', { 'data-testid': 'va-prompt-box' }, h('summary', null, 'Lời nhắn gửi AI (tiếng Anh – sửa được)'), prompt));
genBody.appendChild(_o1.field('AI tạo cảnh', _o1h));
genBody.appendChild(_o1g);
genBody.appendChild(_o1.field('Chất lượng Flow', qualSel));
genBody.appendChild(_og);
genBody.appendChild(h('div', { class: 'bds-row bds-wrap' }, _os));
_oo.innerHTML = '';
_oo.appendChild(h('ol', { class: 'bds-note' },
h('li', null, 'Bấm "Đóng gói cho Flow" (lời nhắn + ảnh tham chiếu, đã chép lời nhắn).'),
h('li', null, 'Mở ', h('a', { href: 'https://labs.google/fx/tools/flow', target: '_blank', rel: 'noopener', 'data-testid': 'va-open-flow' }, 'Google Flow'), ', dán lời nhắn, xem số tín dụng Flow hiện rồi bấm tạo.'),
h('li', null, 'Tải clip về rồi chọn tệp ở đây – app tự ghép vào video: ', _op)));
genBody.appendChild(_oo);
if (!_o24.eng) {
genBody.appendChild(h('p', { class: 'bds-warn', 'data-testid': 'va-need-engine' }, '⚠ Máy dựng chưa bật – cần máy dựng trên máy tính để nhận clip và ghép vào video.'));
topNote.innerHTML = '';
topNote.appendChild(h('div', { class: 'bds-note', 'data-testid': 'va-phone-online' },
h('p', null, 'Đang dùng điện thoại hoặc máy chưa có máy dựng? Tạo clip ngắn ngay ở Video › "Làm bằng AI trên mạng ngay" – app hỏi chi phí trước, clip lưu Google Drive.'),
h('div', { class: 'bds-row bds-wrap' }, _o1.button('Mở Video › Làm bằng AI', () => _o1.nav('content/video'), { kind: 'primary', icon: 'sparkle', testid: 'va-phone-online-open' }))));
} else topNote.innerHTML = '';
}
async function _or() {
if (_o24.busy) return;
const _o19 = _o1h.value;
if (!prompt.value.trim()) { _o1.toast('Nhập mô tả cảnh trước', 'warn'); return; }
if (_o19 === 'flow') return _o1a();
if (!_o24.eng) { _o1.toast('Bật máy dựng trước – clip AI được ghép trên máy dựng', 'warn'); return; }
if (_o19 === 'local') return _o1v();
const e = _ol();
const ok = await _o1.aiConfirm({ id: 'videoai_clip', provider: _o19, providerLabel: L.providerById(_o19).short },
{ est: { usd: e.usd, text: `${L.providerById(_o19).short}: ${L.costText(e)}. Tạo cảnh này?` }, title: 'Xác nhận chi phí', testid: 'va-confirm' });
if (!ok) return;
_o24.busy = true; _o22('Đang gửi yêu cầu tạo cảnh…');
try {
const r = await _o1.api('videoai.start', { provider: _o19, prompt: prompt.value, negative: prompt.dataset.negative || '', seconds: e.seconds, aspect: aspSel.value,
image: _o24.image ? { mime: _o24.image.mime, b64: _o24.image.b64 } : undefined, video_ref: _o24.draft.ref || 'chung', confirm: { usd: e.usd, credits: e.credits } });
_o22(`Đã gửi ${L.providerById(_o19).short} (≈ ${String(r.estimate.usd).replace('.', ',')} USD). Đang chờ AI tạo clip – có thể mất vài phút…`);
_o1d(r.task);
} catch (err) { _o24.busy = false; _o22('✗ ' + (err.message || err), 'error'); }
}
function _o1d(task) {
const _o26 = async () => {
if (!alive()) return;
let r;
try { r = await _o1.api('videoai.poll', { provider: task.provider, id: task.id }); } catch (err) { _o24.busy = false; _o22('✗ ' + (err.message || err), 'error'); return; }
if (r.state === 'running') { _o22(`AI đang tạo clip${r.progress ? ' · ' + Math.round(r.progress * 100) + '%' : ''}…`); _o24.timers.push(setTimeout(_o26, _o4)); return; }
if (r.state === 'error') { _o24.busy = false; _o22('✗ ' + r.message, 'error'); return; }
try {
let _oc;
if (r.download === 'server') {
_o22('Clip xong – đang tải về máy dựng…');
const _om = await _o1.api('videoai.fetch', { uri: r.uri });
_oc = await _o0(`/videoai/import?provider=${task.provider}&kind=${_ox.value}`, { method: 'POST', body: new Blob([L.b64ToBytes(_om.b64)], { type: _om.mime }), timeout: 120000, headers: { 'Content-Type': _om.mime } });
} else {
_oc = await _o0('/videoai/import_url', { method: 'POST', body: { url: r.url, provider: task.provider, kind: _ox.value, prompt: prompt.value }, timeout: 180000 });
}
await _ov(_oc);
} catch (err) { _o22('✗ ' + (err.message || err), 'error'); }
_o24.busy = false;
};
_o24.timers.push(setTimeout(_o26, _o4));
}
async function _o1a() {
const _o1b = L.flowPayload({ title: (_o24.draft.cfg && _o24.draft.cfg.title) || subject.value, prompt: prompt.value, seconds: Number(secSel.value), aspect: aspSel.value, kind: _ox.value,
images: _o24.image ? [{ name: _o24.image.name, mime: _o24.image.mime, b64: _o24.image.b64 }] : [] });
await _o1.copy(prompt.value);
if (_o24.eng) {
try {
const r = await _o0('/videoai/flow_package', { method: 'POST', body: _o1b, raw: true, timeout: 20000 });
if (!r.ok) throw new Error('Máy dựng chưa đóng gói được');
const blob = await r.blob();
const url = URL.createObjectURL(blob);
const _o5 = h('a', { href: url, download: 'goi_flow.zip' });
document.body.appendChild(_o5); _o5.click(); _o5.remove();
setTimeout(() => URL.revokeObjectURL(url), 4000);
_o22('Đã tải gói Flow (.zip) + chép lời nhắn. Mở Flow, tạo clip, rồi chọn tệp clip ở bước 3.', 'ok');
return;
} catch { }
}
_o22('Đã chép lời nhắn. Mở Flow, dán lời nhắn (kèm ảnh tham chiếu nếu có), tạo clip rồi chọn tệp clip ở bước 3.', 'ok');
}
async function _ot() {
const _om = _op.files && _op.files[0];
if (!_om) return;
if (!_o24.eng) { _o1.toast('Bật máy dựng để nhận clip', 'warn'); return; }
_o22('Đang nhận clip Flow…');
try {
const _oc = await _o0(`/videoai/import?provider=flow&kind=${_ox.value}&name=${encodeURIComponent(_om.name)}`, { method: 'POST', body: _om, timeout: 120000, headers: { 'Content-Type': _om.type || 'video/mp4' } });
await _ov(_oc);
} catch (err) { _o22('✗ ' + (err.message || err), 'error'); }
_op.value = '';
}
async function _o1v() {
_o24.busy = true; _o22('Đang khởi động mô hình trên máy…');
const _o13 = (_o24.eng.models.find((m) => m.installed) || {}).id;
if (!_o13) { _o24.busy = false; _o22('✗ Chưa tải mô hình nào – xem phần "AI trên máy" bên dưới.', 'error'); return; }
try {
const r = await _o0('/videoai/local/run', { method: 'POST', body: { model: _o13, prompt: prompt.value, negative: prompt.dataset.negative || '', seconds: Number(secSel.value), aspect: aspSel.value, kind: _ox.value, image: _o24.image ? { mime: _o24.image.mime, b64: _o24.image.b64 } : undefined }, timeout: 20000 });
const _o26 = async () => {
if (!alive()) return;
let _o1w;
try { _o1w = await _o0('/videoai/local/run/' + r.id); } catch (err) { _o24.busy = false; _o22('✗ ' + err.message, 'error'); return; }
if (_o1w.state === 'running') { _o22(`Máy đang tạo clip · ${Math.round((_o1w.progress || 0) * 100)}% (${r.width}×${r.height}, ${r.frames} khung)`); _o24.timers.push(setTimeout(_o26, 2500)); return; }
_o24.busy = false;
if (_o1w.state !== 'done') { _o22('✗ ' + (_o1w.error || 'Đã dừng'), 'error'); return; }
await _ov(await _od(_o1w.clip_id));
};
_o24.timers.push(setTimeout(_o26, 1500));
} catch (err) { _o24.busy = false; _o22('✗ ' + (err.message || err), 'error'); }
}
async function _od(id) { const r = await _o0('/videoai/clips'); return (r.clips || []).find((_o9) => _o9.id === id) || { id }; }
async function _ov(_oc) {
await _o1l();
_o24.draft = L.readDraft(localStorage);
if (!_o24.draft.cfg) { _o22(`✓ Đã có clip ${_oc.id}. Chưa có video đang soạn – soạn video rồi bấm "Chèn" ở danh sách clip.`, 'ok'); return; }
const at = Number(_o6.value);
const r = await _o0('/videoai/insert', { method: 'POST', body: { cfg: _o24.draft.cfg, clip_id: _oc.id, at, kind: _ox.value, subs: subs.value.trim() ? [subs.value.trim()] : [] } });
L.writeDraft(localStorage, r.cfg);
_o1t(); _o1k();
_o22(`✓ Đã ghép cảnh AI vào video (cảnh ${r.index + 1}).${(r.warnings || []).map((w) => ' ⚠ ' + w).join('')} Mở "Video" để Xem trước / Dựng.`, 'ok', true);
}
function _o22(text, tone, link) {
_o17.innerHTML = '';
_o17.appendChild(h('p', { class: tone === 'error' ? 'bds-error' : tone === 'ok' ? 'bds-ok' : 'bds-muted', 'data-testid': tone === 'error' ? 'va-error' : tone === 'ok' ? 'va-done' : 'va-progress' }, text));
if (link) _o17.appendChild(_o1.button('Mở Video để xem trước', () => _o1.nav('content/video'), { testid: 'va-open-video' }));
}
async function _o1l() {
_oe.innerHTML = '';
if (!_o24.eng) { _oe.appendChild(_o1.empty('Bật máy dựng để xem clip AI đã có.')); return; }
let r; try { r = await _o0('/videoai/clips'); } catch { r = { clips: [] }; }
if (!r.clips.length) { _oe.appendChild(_o1.empty('Chưa có clip AI nào.')); return; }
for (const _o9 of r.clips.slice(0, 20)) {
_oe.appendChild(h('div', { class: 'bds-item', 'data-testid': 'va-clip-' + _o9.id },
h('span', null, `${_o9.provider || '?'} · ${(L.KINDS.find((k) => k.id === _o9.kind) || {}).label || 'cảnh'} · ${Math.round((_o9.size || 0) / 1024)} KB${_o9.duration ? ' · ' + _o9.duration + ' giây' : ''}`),
_o1.button('Chèn', async () => { try { await _ov(_o9); } catch (err) { _o1.toast(err.message || String(err), 'error'); } }, { testid: 'va-clip-insert-' + _o9.id })));
}
}
function _o1r() {
_o1e.innerHTML = '';
const rows = (prices().length ? prices() : L.defaultPriceRows()).map((r) => ({ ...r }));
_o1e.appendChild(h('p', { class: 'bds-muted' }, 'Nhập giá theo trang giá chính thức của từng AI (bấm link), ghi ngày kiểm. Chưa có giá → AI trả phí bị khoá nút tạo. Flow: số tín dụng mỗi clip (trừ vào tín dụng AI của gói Google AI Pro).'));
const list = h('div', { class: 'bds-list' });
const _oj = () => {
list.innerHTML = '';
rows.forEach((r, i) => {
const _ou = (key, attrs) => { const _o27 = h('input', { ...attrs, value: r[key] === null || r[key] === undefined ? '' : r[key], 'data-testid': `va-price-${i}-${key}`, disabled: !_o18 });
_o27.addEventListener('input', () => { r[key] = _o27.value; }); return _o27; };
const unit = _o1.select(L.UNITS, r.unit, { 'data-testid': `va-price-${i}-unit`, 'aria-label': 'Đơn vị giá', disabled: !_o18 });
unit.addEventListener('change', () => { r.unit = unit.value; });
const prov = _o1.select(L.PROVIDERS.filter((_o19) => _o19.id !== 'local' && (!_o19.hidden || _o19.id === r.provider)).map((_o19) => [_o19.id, _o19.short]), r.provider, { 'data-testid': `va-price-${i}-provider`, 'aria-label': 'AI', disabled: !_o18 });
prov.addEventListener('change', () => { r.provider = prov.value; });
list.appendChild(h('div', { class: 'bds-item', style: { display: 'flex', flexWrap: 'wrap', gap: '6px' }, 'data-testid': 'va-price-' + i },
prov, _ou('model', { type: 'text', placeholder: 'mô hình (trống = mọi)', 'aria-label': 'Mô hình', size: 16 }), _ou('quality', { type: 'text', placeholder: 'chất lượng', 'aria-label': 'Chất lượng', size: 8 }),
_ou('value', { type: 'number', min: 0, step: 'any', placeholder: 'giá', 'aria-label': 'Giá', size: 6 }), unit,
_ou('credit_usd', { type: 'number', min: 0, step: 'any', placeholder: 'USD/1 tín dụng', 'aria-label': 'Giá 1 tín dụng (USD)', size: 8 }),
_ou('source_url', { type: 'url', placeholder: 'https://… trang giá', 'aria-label': 'Link trang giá', size: 24 }), _ou('checked_at', { type: 'date', 'aria-label': 'Ngày kiểm giá' }),
r.note ? h('small', { class: 'bds-muted' }, r.note) : null,
_o18 ? (() => { const _o7 = _o1.button('✕', () => { rows.splice(i, 1); _oj(); }, { testid: `va-price-${i}-del`, title: 'Xoá dòng giá này' }); _o7.setAttribute('aria-label', 'Xoá dòng giá ' + (i + 1)); return _o7; })() : null));
});
};
_oj();
_o1e.appendChild(list);
if (_o18) {
_o1e.appendChild(h('div', { class: 'bds-row bds-wrap' },
_o1.button('+ Thêm dòng', () => { rows.push({ provider: 'runway', model: '', quality: '', unit: 'usd_per_second', value: null, credit_usd: null, source_url: '', checked_at: '' }); _oj(); }, { testid: 'va-price-add' }),
_o1.button('Lưu bảng giá', async () => {
const _o8 = L.priceProblem(rows);
if (_o8) { _o1.toast(_o8, 'warn'); return; }
try { _o24.status = await _o1.api('videoai.config', { prices: rows.map(L.priceRow).filter(Boolean) }); _o1.toast('Đã lưu bảng giá', 'success'); _o1j(); }
catch (err) { _o1.toast(err.message || String(err), 'error'); }
}, { kind: 'primary', testid: 'va-price-save' })));
}
}
function _o1m() {
if (!_o18) return;
const _ow = !!(_of.querySelector('[data-testid="va-keys"]') || {}).open;
_of.innerHTML = '';
const P = (_o24.status && _o24.status.providers) || {};
if (_o24.status && _o24.status.error) { _of.appendChild(h('p', { class: 'bds-error' }, '✗ ' + _o24.status.error)); return; }
const _ok = {};
const rows = ['veo_api', 'runway', 'kling'].filter((id) => !L.isHidden(id) || (P[id] && P[id].enabled)).map((id) => {
const _o19 = P[id] || {};
_ok[id] = h('input', { type: 'checkbox', checked: !!_o19.enabled, 'data-testid': 'va-en-' + id });
const model = h('input', { type: 'text', value: _o19.model || '', 'data-testid': 'va-model-' + id, size: 22 });
_ok[id].model = model;
return h('div', { class: 'bds-item', style: { display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' } },
h('label', { class: 'va-check' }, _ok[id], ' ', L.providerById(id).short), _o1.badge(_o19.key ? 'Đã có khoá' : 'Chưa có khoá', _o19.key ? 'success' : 'warn'),
id === 'kling' ? _o1.badge('Chưa xác minh', 'danger') : null, h('span', { class: 'bds-muted' }, 'Mô hình:'), model,
L.modelRetired(id, _o19.model) ? h('p', { class: 'bds-warn', 'data-testid': 'va-model-retired-' + id, style: { flexBasis: '100%', margin: 0 } }, '⚠ ' + _o19.model + ': ' + L.RETIRED_TEXT) : null);
});
const ack = h('input', { type: 'checkbox', checked: !!(P.kling && P.kling.ack), 'data-testid': 'va-kling-ack' });
const cap = h('input', { type: 'number', min: 0, step: 'any', value: _o24.status ? _o24.status.cap_video_usd : 5, 'data-testid': 'va-cap', size: 6 });
_of.appendChild(h('div', { class: 'bds-list' }, rows));
_of.appendChild(h('label', { class: 'bds-row va-check' }, ack, ' Kling: tôi đã tự đối chiếu tài liệu API chính thức của Kling (app chưa xác minh được).'));
_of.appendChild(_o1.field('Trần chi phí mỗi video (USD)', cap, 'Mặc định trần 5 USD/video; chi phí cũng cộng vào ngân sách AI tháng.'));
_of.appendChild(_o1.button('Lưu cài đặt', async () => {
const _oa = L.parseCap(cap.value);
if (!_oa.ok) { _o1.toast(_oa.error, 'warn'); return; }
try {
_o24.status = await _o1.api('videoai.config', { enabled: Object.fromEntries(Object.entries(_ok).map(([k, _o27]) => [k, _o27.checked])),
models: Object.fromEntries(Object.entries(_ok).map(([k, _o27]) => [k, _o27.model.value.trim()])), kling_ack: ack.checked, cap_video_usd: _oa.value });
_o1.toast('Đã lưu', 'success'); _o1j();
} catch (err) { _o1.toast(err.message || String(err), 'error'); }
}, { kind: 'primary', testid: 'va-conf-save' }));
const rk = h('input', { type: 'password', autocomplete: 'off', 'data-testid': 'va-key-runway', placeholder: 'Khoá API Runway' });
const ka = h('input', { type: 'password', autocomplete: 'off', 'data-testid': 'va-key-kling-ak', placeholder: 'Access Key Kling' });
const ks = h('input', { type: 'password', autocomplete: 'off', 'data-testid': 'va-key-kling-sk', placeholder: 'Secret Key Kling' });
const _o1y = (_o1b, missing) => async () => {
const _o19 = _o1b();
if (missing && missing(_o19)) { _o1.toast(missing(_o19), 'warn'); return; }
try { _o24.status = await _o1.api('videoai.keys', _o19); _o1.toast('Đã lưu khoá trên máy chủ (không hiện lại)', 'success'); _o1j(); }
catch (err) { _o1.toast(err.message || String(err), 'error'); }
};
const _ob = (target, name) => async () => {
if (!(await _o1.confirm({ title: 'Xoá khoá ' + name + '?', text: 'Khoá ' + name + ' trên máy chủ bị xoá – AI này không tạo được cảnh cho tới khi anh/chị nhập khoá mới.', ok: 'Xoá khoá', kind: 'danger', testid: 'va-key-clear-confirm' }))) return;
try { _o24.status = await _o1.api('videoai.keys', { target, clear: true }); _o1.toast('Đã xoá khoá ' + name, 'success'); _o1j(); }
catch (err) { _o1.toast(err.message || String(err), 'error'); }
};
_of.appendChild(h('details', { 'data-testid': 'va-keys', open: _ow }, h('summary', null, 'Khoá Runway / Kling (lưu trên máy chủ của anh/chị)'),
h('p', { class: 'bds-muted' }, 'Muốn dùng Veo: nhập khoá Runway rồi đặt mô hình veo3… cho Runway ở trên. Khoá chỉ nằm trên máy chủ, app không đọc lại được.'),
h('div', { class: 'bds-row bds-wrap' }, rk, _o1.button('Lưu khoá Runway', _o1y(() => ({ target: 'runway', key: rk.value.trim() }), (_o19) => (_o19.key ? '' : 'Dán khoá Runway vào ô trước khi lưu.')), { testid: 'va-key-save-runway' }),
P.runway && P.runway.key ? _o1.button('Xoá khoá Runway', _ob('runway', 'Runway'), { kind: 'danger', icon: 'x', testid: 'va-key-clear-runway' }) : null),
h('div', { class: 'bds-row bds-wrap' }, ka, ks, _o1.button('Lưu khoá Kling', _o1y(() => ({ target: 'kling', access_key: ka.value.trim(), secret_key: ks.value.trim() }), (_o19) => (_o19.access_key && _o19.secret_key ? '' : 'Dán đủ Access Key và Secret Key của Kling.')), { testid: 'va-key-save-kling' }),
P.kling && P.kling.key ? _o1.button('Xoá khoá Kling', _ob('kling', 'Kling'), { kind: 'danger', icon: 'x', testid: 'va-key-clear-kling' }) : null)));
}
function _o1q() {
_o16.innerHTML = '';
if (!_o24.eng) { _o16.appendChild(_o1.empty('Bật máy dựng để xem máy có chạy được AI trên máy không.')); return; }
_o1p();
const _oq = _o24.eng.gate || {};
_o16.appendChild(h('p', { 'data-testid': 'va-gate' }, _oq.allowed ? _o1.badge('Máy hạng Mạnh – mở được', 'success') : _o1.badge('Chưa mở', 'warn'), ' ', _oq.allowed ? '' : _oq.reason));
const allowed = _o24.eng.models.filter((m) => m.allowed);
const blocked = _o24.eng.models.filter((m) => !m.allowed);
if (_oq.allowed) {
const _o1u = _o24.eng.runtime || {};
_o16.appendChild(h('div', { class: 'bds-row bds-wrap' }, _o1.badge(_o1u.ready ? 'Thư viện chạy mô hình: đã cài' : 'Chưa cài thư viện chạy mô hình', _o1u.ready ? 'success' : 'warn'),
_o1u.ready ? null : _o1.button('Cài thư viện', () => _o21(), { testid: 'va-setup' })));
_o16.appendChild(h('div', { class: 'bds-list' }, allowed.map((m) => h('div', { class: 'bds-item', 'data-testid': 'va-model-row-' + m.id },
h('span', null, m.title, h('br'), h('small', { class: 'bds-muted' }, `Giấy phép ${m.license} · `, _o1x(m.license_url) ? h('a', { href: _o1x(m.license_url), target: '_blank', rel: 'noopener noreferrer' }, 'xem') : 'chưa có link', ` (kiểm ${m.checked})${m.vram_note ? ' · ' + m.vram_note : ''}`)),
m.installed ? _o1.badge('Đã tải', 'success') : _o1.button('Tải mô hình', () => download(m), { testid: 'va-dl-' + m.id })))));
const _oi = _o24.eng.download || {};
if (_oi.state === 'running') _o16.appendChild(h('p', { 'data-testid': 'va-dl-progress' }, `Đang tải ${_oi.model}: ${Math.round((_oi.received || 0) / 1048576)} / ${Math.round((_oi.total || 0) / 1048576)} MB`));
if (_oi.state === 'error') _o16.appendChild(h('p', { class: 'bds-error' }, '✗ Tải mô hình: ' + _oi.error));
}
_o16.appendChild(h('details', { 'data-testid': 'va-blocked' }, h('summary', null, `Mô hình không dùng vì giấy phép (${blocked.length})`),
h('ul', null, blocked.map((m) => h('li', null, h('b', null, m.title), ': ', m.blocked, ' ', _o1x(m.license_url) ? h('a', { href: _o1x(m.license_url), target: '_blank', rel: 'noopener noreferrer' }, 'nguồn') : null)))));
}
function _o1p() {
const _o12 = _o24.eng.mode;
if (!_o12) return;
const _o23 = { installer: 'chọn lúc cài', app: 'đổi trong app', env: 'đặt sẵn khi cài' }[_o12.source] || '';
const sel = _o1.select((_o12.options || []).filter((o) => o.allowed).map((o) => [o.id, o.label]), _o12.mode, { 'data-testid': 'va-mode' });
const pk = _o12.pack || {};
_o16.appendChild(h('div', { class: 'bds-note', 'data-testid': 'va-mode-box' },
h('p', null, h('b', null, 'Cách xử lý video: '), h('span', { 'data-testid': 'va-mode-label' }, _o12.label),
h('small', { class: 'bds-muted' }, _o12.chosen ? (_o23 ? ` (${_o23})` : '') : ' (chưa chọn – mặc định Trên mạng)')),
_o12.mode !== 'offline' ? h('p', { class: 'bds-muted' }, _o12.online_note || '') : null,
_o12.fallback && _o12.fallback.reason ? h('p', { class: 'bds-warn', 'data-testid': 'va-mode-fallback' }, '⚠ ' + _o12.fallback.reason) : null,
!_o12.offline_allowed && _o12.offline_reason ? h('small', { class: 'bds-muted' }, 'Offline: ' + _o12.offline_reason) : null,
pk.installed === false ? h('p', { class: 'bds-muted', 'data-testid': 'va-pack-missing' },
'Chưa cài Bộ công cụ dựng video – ghép clip AI vào video bản đồ cần bộ công cụ này (Video › Cài ngay). Clip AI trên mạng vẫn tạo được.') : null,
h('div', { class: 'bds-row bds-wrap' }, sel, _o1.button('Đổi', async () => {
try {
await _o0('/videoai/mode', { method: 'POST', body: { mode: sel.value } });
await _o10(); _o1q(); _o1s();
_o1.toast('Đã đổi cách xử lý video', 'success');
} catch (err) { _o1.toast(err.message || String(err), 'error'); }
}, { testid: 'va-mode-save' }))));
}
async function download(m) {
let _o1c;
try { _o1c = await _o0('/videoai/local/plan', { method: 'POST', body: { model: m.id }, timeout: 30000 }); } catch (err) { _o1.toast(err.message || String(err), 'error'); return; }
const ok = await _o1.confirm({ title: 'Tải mô hình về máy', testid: 'va-dl-confirm', ok: 'Tải ' + _o1c.total_gb + ' GB',
text: `${m.title}: ${_o1c.total_gb} GB (${_o1c.files.length} tệp, số đo từ Hugging Face). Ổ đĩa còn ${_o1c.free_disk_gb} GB${_o1c.enough_disk ? '' : ' – KHÔNG ĐỦ, cần ' + _o1c.need_gb + ' GB'}. Giấy phép ${_o1c.license}. Tải về chỉ một lần, không kèm trong bộ cài.` });
if (!ok) return;
try { await _o0('/videoai/local/download', { method: 'POST', body: { model: m.id, confirm_bytes: _o1c.total_bytes } }); _o1.toast('Đang tải mô hình…', 'info'); }
catch (err) { _o1.toast(err.message || String(err), 'error'); return; }
const _o26 = async () => { if (!alive()) return; await _o10(); _o1q(); if (_o24.eng && _o24.eng.download && _o24.eng.download.state === 'running') _o24.timers.push(setTimeout(_o26, 3000)); else _o1s(); };
_o24.timers.push(setTimeout(_o26, 1000));
}
async function _o21() {
const ok = await _o1.confirm({ title: 'Cài thư viện chạy mô hình', testid: 'va-setup-confirm', ok: 'Cài',
text: 'Cài torch + diffusers vào máy dựng – tải nhiều GB từ kho Python chính thức (PyPI), mất vài chục phút. Không ảnh hưởng dữ liệu.' });
if (!ok) return;
try { await _o0('/videoai/local/setup', { method: 'POST', body: { confirm: true } }); _o1.toast('Đang cài – xem lại sau ít phút', 'info'); }
catch (err) { _o1.toast(err.message || String(err), 'error'); }
}
async function _oz() {
_o24.chars = (await _o1.list('characters')).filter((_o9) => _o9.lock_en);
charSel.innerHTML = '';
charSel.appendChild(h('option', { value: '' }, _o24.chars.length ? '— Không chọn —' : 'Chưa có nhân vật trong thư viện'));
_o24.chars.forEach((_o9) => charSel.appendChild(h('option', { value: _o9.id }, _o9.name)));
}
function _o1j() { _o1t(); _o1k(); _o1s(); _o1r(); _o1m(); _o1q(); }
_o1o();
await Promise.all([_o11(), _o10(), _oz()]);
if (!alive()) return;
_o1o(); _o1i(); _o1j(); _o1l();
const _o25 = () => _o24.timers.forEach(clearTimeout);
const _o15 = setInterval(() => { if (!alive()) { _o25(); clearInterval(_o15); } }, 5000);
}
function _on(file) {
return new Promise((res, rej) => {
const r = new FileReader();
r.onload = () => res(String(r.result).split(',')[1] || '');
r.onerror = () => rej(new Error('Không đọc được ảnh'));
r.readAsDataURL(file);
});
}
export default {
manifest: {
id: 'videoai_taocanh', title: 'Video AI', icon: '✨', screen: 'content', order: 15, version: '0.1.0', status: 'ready',
requires: 'video',
help: 'Thử nghiệm. AI tạo cảnh nhân vật dẫn, phối cảnh 3D, phong thuỷ, minh hoạ, cảnh quay phụ (B-roll) rồi ghép vào video của máy dựng. Chọn AI: Flow (tín dụng gói Google AI Pro, mặc định), Runway (có Veo), Kling, hoặc AI trên máy (máy hạng Mạnh). Báo chi phí trước mỗi lần tạo theo bảng giá Chủ nhập. Cảnh bản đồ/số liệu vẫn do máy dựng làm; cảnh 3D/phong thủy ghi "Ảnh minh hoạ".',
},
mount,
async selftest() {
const d = [];
try {
const e = L.estimate([{ provider: 'runway', unit: 'usd_per_second', value: 0.5 }], { provider: 'runway', seconds: 8 });
if (!e.ok || e.usd !== 4) d.push('Ước tính chi phí sai');
if (L.estimate([], { provider: 'runway', seconds: 5 }).ok) d.push('Thiếu giá phải báo thiếu');
if (!L.engineMade({ camera: { fit: ['a'] } }) || L.engineMade({ type: 'ai_clip', media: {} })) d.push('Nhận diện cảnh máy dựng sai');
if (!L.needsLabel('fengshui') || L.needsLabel('presenter')) d.push('Quy tắc nhãn ẢNH MINH HOẠ sai');
} catch (err) { d.push('Lỗi: ' + (err && err.message)); }
return { ok: !d.length, details: d.length ? d : ['Video AI: logic OK'] };
},
};

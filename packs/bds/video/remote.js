import { h } from '../_lib/kit.js';
import * as R from '../_lib/remote_video.js';
import { scriptUrl } from '../../../core/api.024f831cb4.js';
export function remotePanel(ctx, K, deps) {
const owner = ((ctx.user && ctx.user.role) || 'owner') === 'owner';
const role = (ctx.user && ctx.user.role) || 'owner';
const _o11 = { jobs: [], engine: null, now: Date.now(), timer: 0, aiTimer: 0, link: null, sending: false, aiBusy: false };
const _o4 = () => { try { return !ctx.packs || typeof ctx.packs.moduleOn !== 'function' || ctx.packs.moduleOn('videoai_taocanh') !== false; } catch { return false; } };
const _o13 = () => { try { return !!(ctx.video && typeof ctx.video.hidden === 'function' && ctx.video.hidden()); } catch { return false; } };
const _ok = () => { try { return !!(ctx.video && typeof ctx.video.online === 'function' && ctx.video.online()); } catch { return false; } };
const linked = () => !!(_o11.engine && _o11.engine.linked);
const _o10 = () => !_ok() || linked();
const _oe = (name) => { try { const _ob = ctx.ui && ctx.ui.icon; return _ob ? _ob(name, 18) : null; } catch { return null; } };
const _of = (label, href, name, testid) => h('a', { class: 'bds-btn bds-btn-x bds-btn-ghost', href, target: '_blank', rel: 'noopener', 'data-testid': testid, 'data-icon': name }, _oe(name), ' ', label);
const engineLine = h('p', { class: 'bds-muted', 'data-testid': 'remote-engine' }, 'Đang xem máy tính…');
const linkBox = h('div', { 'data-testid': 'remote-link-box' });
const choiceBox = h('div', { 'data-testid': 'remote-choice', style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' } });
const _on = h('div', { class: 'bds-list', 'data-testid': 'remote-queue' });
const msg = h('div', { 'data-testid': 'remote-msg', 'aria-live': 'polite' });
const _ow = K.select([[5, '5 giây'], [8, '8 giây'], [10, '10 giây']], 8, { 'data-testid': 'ai-online-seconds', 'aria-label': 'Thời lượng clip' });
const _o3 = h('p', { class: 'bds-muted', 'data-testid': 'ai-online-cost' });
_ow.addEventListener('change', () => _os());
const _oy = K.button('Gửi máy tính dựng', () => _ox(), { kind: 'primary', icon: 'content', testid: 'remote-send' });
const _o2 = K.button('Làm bằng AI trên mạng ngay', () => _o5(), { kind: 'primary', icon: 'sparkle', testid: 'ai-online-start' });
_o2.appendChild(K.aiBadge({ id: 'videoai_clip' }));
const _or = K.button('Làm mới', () => refresh(), { icon: 'refresh', testid: 'remote-refresh' });
const el = h('div', { class: 'bds-form', 'data-testid': 'remote-panel' },
h('div', { class: 'bds-row bds-wrap', style: { alignItems: 'center' } }, engineLine, _or),
linkBox, choiceBox, msg,
h('h4', null, 'Video gửi đi'), _on);
const _oz = (text, tone = 'muted') => { msg.innerHTML = ''; if (text) msg.appendChild(h('p', { class: tone === 'error' ? 'bds-error' : tone === 'ok' ? 'bds-ok' : 'bds-muted' }, text)); };
const _oc = () => String(deps.title() || 'video').slice(0, 60);
function _os() {
choiceBox.innerHTML = '';
const outline = deps.outline();
const e = R.engineInfo(_o11.engine, _o11.now);
const mine = !!(_o11.engine && _o11.engine.mine), ownLinked = mine && !!_o11.engine.linked;
if (mine) e.text = ownLinked ? (_o11.engine.online ? '🟢 Máy dựng của bạn đang bật' : '⚪ Máy dựng của bạn đang tắt – video tự dựng khi máy tính của bạn bật và mở BDS Studio.')
: 'Chưa liên kết máy dựng của bạn. Mở BDS Studio trên máy tính đã cài bộ tạo video › Video › "Liên kết máy dựng với tài khoản".';
_oy.disabled = !outline || _o11.sending || (mine && !ownLinked);
engineLine.hidden = !_o10() || mine;
if (_o10()) choiceBox.appendChild(h('div', { class: 'bds-note', 'data-testid': 'choice-remote' },
h('p', null, h('b', null, mine ? 'Gửi máy tính dựng (máy của bạn)' : 'Gửi máy tính dựng'), ' ', K.badge('miễn phí – dựng khi máy tính bật', 'success')),
mine ? h('p', { class: 'bds-muted', 'data-testid': 'choice-remote-engine' }, e.text) : null,
h('p', { class: 'bds-muted' }, 'Máy tính tra bản đồ thật, dựng MP4 có phụ đề' + (deps.voice() ? ' + giọng Vbee (tính ký tự trên tài khoản Vbee)' : '') + ', lưu Google Drive và báo Telegram.'),
outline ? null : h('small', { class: 'bds-muted', 'data-testid': 'choice-need-approve' }, 'Soạn và bấm "Duyệt dàn cảnh" trước.'),
h('div', { class: 'bds-row bds-wrap' }, _oy)));
const ai = h('div', { class: 'bds-note', 'data-testid': 'choice-ai' },
h('p', null, h('b', null, 'Làm bằng AI trên mạng ngay'), ' ', K.badge('thu phí riêng', 'warn')),
h('p', { class: 'bds-muted' }, 'Không cần máy tính: AI tạo 1 clip ngắn (tối đa 10 giây; Veo tối đa 8 giây) minh hoạ từ kịch bản, lưu Google Drive. Không có bản đồ thật/số liệu – video bản đồ cần máy tính.'),
outline || !_ok() ? null : h('small', { class: 'bds-muted', 'data-testid': 'choice-ai-need-approve' }, 'Soạn và bấm "Duyệt dàn cảnh" ở trên trước.'));
const packOn = _o4();
_o3.textContent = packOn ? 'Bấm nút để xem nhà cung cấp đang bật và chi phí ước tính – app luôn hỏi trước khi gửi.'
: 'Gói "Video AI" chưa cài hoặc đang tắt – ' + (owner ? 'cài trong Cài đặt › Gói chức năng, rồi bật Runway/Kling + nhập bảng giá.' : 'nhờ Quản trị (Admin) bật.');
_o2.disabled = !packOn || !outline || _o11.aiBusy;
ai.appendChild(h('div', { class: 'bds-row bds-wrap' }, K.field('Thời lượng', _ow)));
ai.appendChild(_o3);
if (!packOn && owner) ai.appendChild(K.button('Mở Gói chức năng', () => K.nav('settings/packs'), { icon: 'puzzle', testid: 'ai-online-packs' }));
ai.appendChild(h('div', { class: 'bds-row bds-wrap' }, _o2));
choiceBox.appendChild(ai);
}
async function _ox() {
const outline = deps.outline();
if (!outline) { K.toast('Duyệt dàn cảnh trước', 'warn'); return; }
const _o9 = deps.captions() || {};
const body = R.submitPayload({ outline, title: deps.title(), voice: deps.voice(), ref: (deps.scriptId() || 'v') + ':' + (outline.title || '').slice(0, 20) + ':' + Date.now().toString(36).slice(0, -3),
scriptId: deps.scriptId(), captionText: _o9.caption_text, tgCaption: _o9.tg_caption });
if (deps.voice() && !(await K.aiConfirm('vbee_voice', { testid: 'remote-vbee-cost', lead: 'Máy tính sẽ dựng có giọng đọc Vbee. Bỏ tick "Giọng Vbee" nếu muốn dựng không giọng (0 đồng).' }))) return;
_o11.sending = true; _os();
try {
const _oo = await K.api('video.remote_submit', body);
_o11.engine = _oo.engine || _o11.engine;
const e = R.engineInfo(_o11.engine, _o11.now);
_oz(_oo.duplicate ? 'Video này đã nằm trong hàng chờ.' : '✓ Đã gửi máy tính dựng. ' + (e.state === 'on' ? 'Máy tính đang bật – sẽ nhận trong ít phút.' : e.text), 'ok');
K.toast('Đã gửi máy tính dựng', 'success');
await refresh();
} catch (err) { _oz('✗ ' + ((err && err.message) || 'Chưa gửi được'), 'error'); }
finally { _o11.sending = false; _os(); }
}
async function _o5() {
const outline = deps.outline();
if (!outline || !_o4() || _o11.aiBusy) return;
_o11.aiBusy = true; _os();
try {
let _o0, status;
try { _o0 = await import('../videoai_taocanh/logic.js'); } catch { _oz('✗ Chưa mở được gói Video AI – cài lại gói trong Cài đặt › Gói chức năng.', 'error'); return; }
try { status = await K.api('videoai.status', {}); } catch (e) {
_oz('✗ ' + (e && e.code === 'FORBIDDEN' ? 'Gói "Video AI" chưa cài hoặc đang tắt – ' + (owner ? 'cài trong Cài đặt › Gói chức năng.' : 'nhờ Quản trị (Admin) bật.') : ((e && e.message) || 'Chưa xem được Video AI')), 'error');
return;
}
const _o6 = R.aiChoices(_o0, status, { seconds: Number(_ow.value), role });
const _oq = _o6.filter((c) => c.ok);
if (!_oq.length) {
_oz('Chưa có nhà cung cấp Video AI nào sẵn sàng: ' + _o6.map((c) => c.label + ' – ' + c.why).join(' · ') + (owner ? ' Mở Video AI › Cài đặt để bật và nhập bảng giá.' : ''), 'error');
return;
}
const ch = _oq.length === 1 ? _oq[0] : await pickProvider(_o0, _oq);
if (!ch) return;
const _ol = R.aiPrompt(_o0, outline, { seconds: Number(_ow.value) });
const ok = await K.aiConfirm({ id: 'videoai_clip', provider: ch.id, providerLabel: ch.label },
{ est: { usd: ch.est.usd, credits: ch.est.credits, text: R.costLine(_o0, ch, { owner }) }, title: 'Làm bằng AI trên mạng – xác nhận chi phí', testid: 'ai-online-confirm',
lead: `${ch.label} tạo clip ${ch.est.seconds} giây từ kịch bản "${String(deps.title() || '').slice(0, 60)}". Thu phí riêng theo nhà cung cấp.` });
if (!ok) return;
const body = { provider: ch.id, prompt: _ol.prompt, negative: _ol.negative, seconds: ch.est.seconds, aspect: '9:16', request_id: R.requestId(),
title: _oc(), video_ref: deps.scriptId() || 'phone', script_id: deps.scriptId() || '', confirm: { usd: ch.est.usd, credits: ch.est.credits } };
try {
const _oo = await K.api('video.ai_online_start', body);
_oz(`✓ Đã gửi ${ch.label} (≈ ${R.vnNum(_oo.estimate && _oo.estimate.usd)} USD). AI đang tạo – xem tiến độ bên dưới.`, 'ok');
await refresh();
} catch (err) {
if (!R.uncertainSend(err)) { _oz('✗ ' + ((err && err.message) || 'Chưa gửi được'), 'error'); return; }
_oz('Mạng chập chờn – đang kiểm xem yêu cầu đã tới máy chủ chưa (không tính tiền 2 lần)…', 'muted');
try {
const _op = await K.api('video.ai_online_start', body);
_oz(`✓ Đã gửi ${ch.label} (≈ ${R.vnNum(_op.estimate && _op.estimate.usd)} USD). AI đang tạo – xem tiến độ bên dưới.`, 'ok');
} catch (err2) {
_oz('⚠ Chưa rõ yêu cầu đã tới nhà cung cấp chưa (mạng yếu). Xem "Video gửi đi" bên dưới trước khi bấm lại – tránh tạo và trả tiền 2 lần.', 'error');
}
await refresh();
}
} finally { _o11.aiBusy = false; _os(); }
}
function pickProvider(_o0, _oq) {
return new Promise((resolve) => {
let _oa = false;
const _oj = K.modal({ title: 'Chọn nhà cung cấp Video AI', testid: 'ai-online-pick', body: h('div', { class: 'bds-list' },
_oq.map((c) => h('div', { class: 'bds-item', style: { display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: '4px' } },
K.button(c.label, () => { _oa = true; _oj && _oj.close && _oj.close(); resolve(c); }, { kind: 'primary', icon: 'sparkle', testid: 'ai-online-pick-' + c.id }),
h('small', { class: 'bds-muted' }, R.costLine(_o0, c, { owner })))),
K.button('Huỷ', () => { _oa = true; _oj && _oj.close && _oj.close(); resolve(null); }, { icon: 'x', testid: 'ai-online-pick-cancel' })) });
const _o15 = setInterval(() => { if (_oa || !(_oj && _oj.el && _oj.el.isConnected)) { clearInterval(_o15); if (!_oa) { _oa = true; resolve(null); } } }, 400);
});
}
async function _ot() {
linkBox.innerHTML = '';
if (!deps.local()) return;
try { _o11.link = await deps.engine('/remote/status', { timeout: 3000 }); } catch { _o11.link = null; }
if (!_o11.link) return;
if (!owner) { try { _o11.vm = await K.api('vm.status', {}); } catch { _o11.vm = null; } }
if (_o11.link.linked) {
linkBox.appendChild(h('div', { class: 'bds-row bds-wrap', 'data-testid': 'remote-linked' }, K.badge('Máy dựng này đã liên kết – tự nhận video gửi từ điện thoại', 'success'),
owner || (_o11.vm && _o11.vm.company) ? K.button('Bỏ liên kết', unlink, { icon: 'logout', testid: 'remote-unlink' }) : null));
return;
}
const _o14 = _o11.vm && _o11.vm.company ? _o11.vm : null;
const _o7 = owner || !!(_o14 && _o14.can_link);
linkBox.appendChild(h('div', { class: 'bds-note', 'data-testid': 'remote-unlinked' },
h('p', null, _o11.link.revoked ? 'Vé máy dựng đã bị thu hồi – liên kết lại để nhận video từ điện thoại.' : 'Liên kết máy dựng này với tài khoản để làm video từ điện thoại: điện thoại bấm "Gửi máy tính dựng", máy tính tự dựng khi đang bật.'),
h('small', { class: 'bds-muted' }, 'Vé riêng, quyền hạn chế (chỉ nhận/trả việc video), 90 ngày – thu hồi ở Cài đặt › Bảo mật › Thiết bị.'),
_o14 ? h('small', { class: 'bds-muted', 'data-testid': 'remote-link-mine' }, 'Máy dựng này chỉ làm video của riêng anh/chị – không nhận video của người khác.') : null,
_o7 ? h('div', { class: 'bds-row bds-wrap' }, K.button('Liên kết máy dựng với tài khoản', link, { kind: 'primary', icon: 'link', testid: 'remote-link' }))
: _o14 && _o14.video ? (_o14.state === 'pending' ? h('p', { class: 'bds-muted', 'data-testid': 'remote-link-asked' }, 'Đã xin – chờ Quản trị duyệt.')
: h('div', { class: 'bds-row bds-wrap' }, K.button('Xin Quản trị cho phép', askAdmin, { kind: 'primary', icon: 'shield', testid: 'remote-link-ask' })))
: h('p', { class: 'bds-muted' }, 'Chỉ Quản trị (Admin) liên kết được máy dựng.')));
}
async function askAdmin() {
try { await K.api('vm.request', {}); K.toast('Đã gửi lời xin tới Quản trị', 'success'); _ot(); } catch (e) { K.toast((e && e.message) || 'Chưa gửi được', 'warn'); }
}
async function link() {
const url = scriptUrl(ctx.config || {});
if (!url) { K.toast('Chế độ Dùng thử: chưa có máy chủ thật để liên kết máy dựng', 'warn'); return; }
let _o12;
try { _o12 = await K.api('engine.token', { name: 'Máy dựng video – ' + (_o11.link.os || 'máy tính') }); } catch (e) { K.toast((e && e.message) || 'Chưa lấy được vé máy dựng', 'warn'); return; }
try { await deps.engine('/remote/link', { method: 'POST', body: { server: { url, token: _o12.token }, name: 'Máy dựng video' }, timeout: 10000 }); }
catch (e) { K.toast((e && e.message) || 'Máy dựng chưa nhận', 'warn'); return; }
K.toast(owner ? 'Đã liên kết máy dựng – điện thoại gửi video là máy này tự dựng' : 'Đã liên kết máy dựng của bạn – điện thoại của bạn gửi video là máy này tự dựng', 'success');
if (!owner) { try { if (ctx.video && typeof ctx.video.setMode === 'function') await ctx.video.setMode('machine', 'engine_link'); } catch { } }
_ot(); refresh();
}
async function unlink() {
if (!(await K.confirm({ title: 'Bỏ liên kết máy dựng', text: 'Máy này thôi nhận video gửi từ điện thoại. Muốn thu hồi hẳn vé: Cài đặt › Bảo mật › Thiết bị.', ok: 'Bỏ liên kết', testid: 'remote-unlink-confirm' }))) return;
try { await deps.engine('/remote/unlink', { method: 'POST', body: {} }); } catch (e) { K.toast((e && e.message) || 'Máy dựng chưa nhận', 'warn'); return; }
_ot();
}
function _ou() {
_on.innerHTML = '';
if (!_o11.jobs.length) { _on.appendChild(K.empty('Chưa gửi video nào.')); return; }
for (const _oh of _o11.jobs.slice(0, 20)) {
const _og = R.jobInfo(_oh, _o11.engine, _o11.now);
const _oi = _oh.status === 'done' ? R.driveLinks(_oh.file) : null;
const _o1 = [];
if (_oi) {
_o1.push(_of('Xem', _oi.view, 'content', 'rjob-view-' + _oh.id), _of('Tải về', _oi.download, 'disk', 'rjob-dl-' + _oh.id));
_o1.push(K.button('Chia sẻ', () => share(_oh, _oi), { icon: 'link', testid: 'rjob-share-' + _oh.id }));
}
if (_oh.type === R.TYPES.remote && _oh.status === 'queued') _o1.push(K.button('Huỷ', () => _o8(_oh), { icon: 'x', testid: 'rjob-cancel-' + _oh.id }));
const clip = _oh.status === 'error' ? R.clipLink(_oh) : null;
if (clip) _o1.push(_of('Tải clip (link tạm)', clip, 'disk', 'rjob-clip-' + _oh.id));
_on.appendChild(h('div', { class: 'bds-item', style: { display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: '6px' }, 'data-testid': 'rjob-' + _oh.id, 'data-state': _og.key },
h('div', { class: 'bds-row-main' }, h('strong', null, _oh.title || 'Video'),
h('span', { class: 'bds-sub' }, (_oh.type === R.TYPES.ai ? '✨ AI trên mạng · ' + R.providerLabel(_oh.provider) : '💻 Máy tính') + ' · ' + R.hhmm(_oh.created_at || _oh.updated_at) + (_oh.created_by_name ? ' · ' + _oh.created_by_name : ''))),
h('div', { class: 'bds-row bds-wrap' }, K.badge(_og.label, _og.tone),
_og.key === 'rendering' || _og.key === 'ai' ? h('progress', { max: 100, value: _og.pct, style: { flex: '1', minWidth: '100px' } }) : null),
_og.note ? h('small', { class: _og.key === 'error' ? 'bds-error' : 'bds-muted', 'data-testid': 'rjob-note-' + _oh.id }, _og.note) : null,
_o1.length ? h('div', { class: 'bds-row bds-wrap' }, _o1) : null));
}
}
async function share(_oh, _oi) {
try { if (navigator.share) { await navigator.share({ title: _oh.title || 'Video', url: _oi.view }); return; } } catch { return; }
await K.copy(_oi.view); K.toast('Đã chép link Drive', 'success');
}
async function _o8(_oh) {
try { await K.api('video.remote_cancel', { id: _oh.id }); K.toast('Đã huỷ', 'success'); } catch (e) { K.toast((e && e.message) || 'Chưa huỷ được', 'warn'); }
refresh();
}
async function refresh() {
clearTimeout(_o11.timer);
if ((!el.isConnected && _o11.loaded) || _o13()) return;
try {
const _oo = await K.api('video.remote_list', {});
_o11.jobs = _oo.jobs || []; _o11.engine = _oo.engine || null; _o11.now = Number(_oo.server_time) || Date.now();
engineLine.textContent = R.engineInfo(_o11.engine, _o11.now).text;
engineLine.hidden = !_o10() || !!(_o11.engine && _o11.engine.mine);
} catch (e) { engineLine.textContent = (e && e.missingAction) ? 'Máy chủ chưa có "Gửi máy tính dựng" – cập nhật máy chủ.' : 'Chưa xem được hàng chờ: ' + ((e && e.message) || ''); }
_o11.loaded = true;
_ou(); _os();
_om();
_o11.timer = setTimeout(() => { if (el.isConnected) refresh(); }, R.nextPollMs(_o11.jobs));
}
function _om() {
clearTimeout(_o11.aiTimer);
const _ov = _o11.jobs.find((_oh) => _oh.type === R.TYPES.ai && _oh.status === 'running');
if (!_ov) return;
_o11.aiTimer = setTimeout(async () => {
if (!el.isConnected) return;
try {
const _oo = await K.api('video.ai_online_poll', { id: _ov.id });
const _od = _o11.jobs.findIndex((x) => x.id === _ov.id);
if (_od >= 0 && _oo && _oo.job) _o11.jobs[_od] = _oo.job;
_ou();
if (_oo && _oo.job && _oo.job.status === 'done') K.toast('Video AI xong – đã lưu Drive', 'success');
} catch { }
_om();
}, R.POLL_AI_MS);
}
return {
el,
async start() { if (_o13()) return; _os(); await _ot(); await refresh(); },
hidden: _o13,
refresh,
rerender() { _os(); _ot(); },
focus() { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); },
};
}

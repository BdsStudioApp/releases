import { t } from './i18n.17f01a0b54.js';
import { ls } from './xkit.71d637c634.js';
export const DONE_KEY = 'bds:onb';
export const WORDS = {
'onb.title': 'Cài lần đầu (~10 phút)',
'onb.lead': 'Làm lần lượt 5 bước. Mỗi bước có nút Kiểm tra – xanh là xong.',
'onb.start': 'Bắt đầu cài',
'onb.later': 'Để sau',
'onb.banner': 'Mới dùng? Cài lần đầu khoảng 10 phút để app chạy thật.',
'onb.check': 'Kiểm tra',
'onb.open': 'Mở hướng dẫn',
'onb.done': 'Xong – đã cài đủ bước bắt buộc.',
'onb.progress': 'Đã xong {n}/{total} bước',
'onb.step.server': 'Máy chủ Apps Script',
'onb.step.server.how': 'Cài đặt → Kết nối → Máy chủ: làm theo các phần A–D, dán URL rồi Lưu.',
'onb.step.gemini': 'Khoá Gemini (AI miễn phí)',
'onb.step.gemini.how': 'Cài đặt → Kết nối → Gemini API: tạo khoá ở aistudio.google.com, dán vào, Lưu.',
'onb.step.telegram': 'Telegram báo tin',
'onb.step.telegram.how': 'Cài đặt → Kết nối → Telegram: tạo bot với @BotFather, dán mã, bấm Tự tìm chat id.',
'onb.step.profile': 'Thông tin cá nhân',
'onb.step.profile.how': 'Điền họ tên và số điện thoại – dùng để ký tên trên tài liệu gửi khách.',
'onb.step.engine': 'Máy dựng trên máy tính (tuỳ chọn)',
'onb.step.engine.how': 'Chỉ cần nếu làm video trên máy: tải bộ cài ở màn Video, bấm đúp để chạy.',
'onb.demo': 'Đang xem thử – máy chủ xem thử luôn trả lời. Dán URL thật ở bước 1 để dùng thật.',
'onb.wizard.lead': 'Hướng dẫn cài đặt nằm trong Trợ lý cài đặt: từng bước có ảnh, nút "Kiểm tra bước này" và cách sửa khi chưa đạt (máy chủ, Telegram, AI, tên miền…).',
'onb.wizard.open': 'Mở Trợ lý cài đặt',
'onb.wizard.banner': 'Mới dùng? Trợ lý cài đặt dẫn từng bước còn lại (Telegram, AI, tên miền…).',
'help.onboarding': 'Hướng dẫn cài lần đầu: máy chủ, AI Gemini, Telegram, thông tin cá nhân. Mở lại bất kỳ lúc nào ở Cài đặt → Cài lần đầu hoặc gõ "cài lần đầu" vào ô Hỏi app.'
};
export const STEPS = [
{ id: 'server', required: true, section: 'connection' },
{ id: 'gemini', required: true, section: 'connection' },
{ id: 'telegram', required: true, section: 'connection' },
{ id: 'profile', required: true, section: 'profile' },
{ id: 'engine', required: false, section: 'connection' }
];
export function progressOf(results) {
const done = STEPS.filter((s) => results[s.id] === true).length;
const _o6 = STEPS.filter((s) => s.required && results[s.id] !== true).map((s) => s.id);
return { done, total: STEPS.length, requiredLeft: _o6, complete: !_o6.length };
}
export function shouldAutoShow(state, { role } = {}) {
if (role && role !== 'owner') return false;
return !(state && (state.dismissed || state.complete));
}
export function state() { return ls.get(DONE_KEY, {}) || {}; }
export const useWizard = (config) => !!config && String(config.edition || 'owner') !== 'owner';
function _o9({ nav } = {}) {
const _oi = typeof window !== 'undefined' && window.__bds && window.__bds.wizard;
if (_oi && typeof _oi.open === 'function') return _oi.open();
if (nav) nav('settings/wizard');
return null;
}
function _ok(ctx, onGo) {
const { ui } = ctx; const { h, button } = ui;
return h('div', { class: 'stack', 'data-testid': 'onb-wizard' }, h('p', null, t('onb.wizard.lead')),
h('div', { class: 'btn-row' }, button(t('onb.wizard.open'), () => { if (onGo) onGo(); _o9(ctx); }, { kind: 'primary', small: true, testid: 'onb-open-wizard' })));
}
export function saveState(patch) { return ls.set(DONE_KEY, { ...state(), ...patch }); }
export function makeChecks({ api, settings, config = {}, fetchFn = (u, o) => fetch(u, o) }) {
const _o5 = (config.ENGINE_URL || 'http://127.0.0.1:8765').replace(/\/$/, '');
const _o1 = async (target) => {
try { const _o3 = await api.call('connections.test', { target }); return { ok: !!_o3.ok, msg: _o3.message || '' }; } catch (e) { return { ok: false, msg: e.userMessage || e.message || '' }; }
};
return {
async server() {
try { const _o3 = await api.call('status'); return { ok: !!_o3, msg: (api.mode === 'demo' ? t('onb.demo') + ' ' : '') + 'v' + ((_o3 && _o3.version) || '?') }; } catch (e) { return { ok: false, msg: e.userMessage || t('err.network') }; }
},
gemini: () => _o1('gemini'),
telegram: () => _o1('telegram'),
async profile() { const _oa = settings.get('profile', {}) || {}; const ok = !!(String(_oa.name || '').trim() && String(_oa.phone || '').trim()); return { ok, msg: ok ? _oa.name : t('onb.step.profile.how') }; },
async engine() {
const _o2 = new AbortController(); const _oh = setTimeout(() => _o2.abort(), 2500);
try { const _od = await fetchFn(_o5 + '/health', { signal: _o2.signal }); return { ok: _od.ok, msg: _od.ok ? 'đang chạy' : 'HTTP ' + _od.status }; } catch { return { ok: false, msg: t('onb.step.engine.how') }; } finally { clearTimeout(_oh); }
}
};
}
export function renderOnboarding(body, { ui, api, settings, config, nav, onClose, video = null }) {
if (useWizard(config)) { body.append(_ok({ ui, nav }, onClose)); return { runAll: async () => [] }; }
const { h, button, status: st, field, toast } = ui;
const _o0 = makeChecks({ api, settings, config });
const results = { ...(state().results || {}) };
const head = h('p', { class: 'muted', 'data-testid': 'onb-progress' });
const list = h('ol', { class: 'xo-steps', 'data-testid': 'onb-steps' });
body.append(h('p', null, t('onb.lead')), head, list);
const steps = STEPS.filter((s) => !(s.id === 'engine' && video && (video.engineOff ? video.engineOff() : video.hidden())));
const _of = steps.map((s, i) => {
const mark = h('span', { class: 'xo-st' }, st(results[s.id] === true ? true : results[s.id] === false ? false : null));
const msg = h('span', { class: 'muted small xo-msg' });
const extra = s.id === 'profile' ? _oc() : null;
const _o7 = h('li', { class: 'xo-step', dataset: { step: s.id } },
h('div', { class: 'xo-head' }, h('span', { class: 'xo-n' }, String(i + 1)), h('strong', null, t('onb.step.' + s.id)), mark),
h('p', { class: 'muted small' }, t('onb.step.' + s.id + '.how')), extra,
h('div', { class: 'btn-row' },
button(t('onb.check'), () => _og(s.id), { kind: 'secondary', small: true, icon: 'pulse', testid: 'onb-check-' + s.id }),
s.section && s.id !== 'profile' ? button(t('onb.open'), () => { if (onClose) onClose(); nav('settings/' + s.section + (s.section === 'connection' ? '/' + s.id : '')); }, { kind: 'ghost', small: true }) : null),
msg);
list.appendChild(_o7);
return { id: s.id, mark, msg };
});
_ob();
return { runAll: () => Promise.all(steps.map((s) => _og(s.id))) };
function _oc() {
const _oa = settings.get('profile', {}) || {};
const name = field({ label: t('set.profile.name'), value: _oa.name || '', autocomplete: 'name', id: 'onb-name' });
const phone = field({ label: t('set.profile.phone'), type: 'tel', value: _oa.phone || '', inputmode: 'tel', autocomplete: 'tel', id: 'onb-phone' });
return h('div', null, h('div', { class: 'grid-2' }, name, phone), h('div', { class: 'btn-row' }, button(t('common.save'), async () => {
await settings.set('profile', { ...(settings.get('profile', {}) || {}), name: String(name.getValue() || '').trim(), phone: String(phone.getValue() || '').trim() });
toast(t('common.saved'), 'ok'); await _og('profile');
}, { kind: 'primary', small: true, testid: 'onb-profile-save' })));
}
async function _og(id) {
const _od = _of.find((x) => x.id === id);
ui.mountTo(_od.mark, st(null));
const _oe = await _o0[id]();
results[id] = !!_oe.ok;
ui.mountTo(_od.mark, st(!!_oe.ok)); _od.msg.textContent = _oe.msg || '';
_ob();
return _oe;
}
function _ob() {
const _oa = progressOf(results);
head.textContent = t('onb.progress', { n: _oa.done, total: _oa.total }) + (_oa.complete ? ' · ' + t('onb.done') : '');
saveState({ results, complete: _oa.complete });
}
}
export function openOnboarding(ctx) {
const { ui } = ctx;
const body = ui.h('div', { class: 'xo', 'data-testid': 'onboarding' });
if (useWizard(ctx.config)) { saveState({ dismissed: true }); return _o9(ctx); }
const _o8 = ui.modal({ title: t('onb.title'), body, wide: true, actions: [{ label: t('onb.later'), kind: 'ghost', onClick: () => { saveState({ dismissed: true }); } }, { label: t('common.close'), kind: 'primary' }] });
renderOnboarding(body, { ...ctx, onClose: () => _o8.close() });
return _o8;
}
export function banner(ctx) {
const { ui } = ctx; const { h, button } = ui;
const _oj = useWizard(ctx.config);
const _o4 = h('div', { class: 'xo-banner card', role: 'note', 'data-testid': 'onb-banner' },
h('span', { class: 'card-ico' }, ui.icon('check', 20)),
h('p', null, t(_oj ? 'onb.wizard.banner' : 'onb.banner')),
h('div', { class: 'btn-row' },
button(t(_oj ? 'onb.wizard.open' : 'onb.start'), () => { _o4.remove(); openOnboarding(ctx); }, { kind: 'primary', small: true, icon: 'next', testid: 'onb-start' }),
button(t('onb.later'), () => { saveState({ dismissed: true }); _o4.remove(); }, { kind: 'ghost', small: true, icon: 'clock', testid: 'onb-later' })));
return _o4;
}
export default { STEPS, progressOf, shouldAutoShow, makeChecks, renderOnboarding, openOnboarding, banner, useWizard };

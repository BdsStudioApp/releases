import { engineDownload } from './engine_dl.18c8a720c5.js';
import { ensureCss } from './xkit.e7637ba4a6.js';
export const HW_KEY = 'bds:vm:hw';
export const SNOOZE_KEY = 'bds:vm:snooze';
export const TOLD_KEY = 'bds:vm:told';
export const HW_TTL = 30 * 86400000;
export const SNOOZE_MS = 14 * 86400000;
export const TIERS_OK = ['manh', 'kha'];
export const TEXT = {
strongTitle: 'Máy này đủ mạnh để làm video',
strong: 'Máy này đủ mạnh để làm video. Cài bộ tạo video để dựng video bản đồ/quy hoạch miễn phí ngay trên máy, kết hợp AI trên mạng khi cần (AI tính phí riêng, hỏi trước mỗi lần).',
softTitle: 'Máy này làm được video',
soft: 'Máy này cấu hình Khá – dựng được video bản đồ/quy hoạch trên máy (chậm hơn máy mạnh). Có thể cài bộ tạo video để làm miễn phí trên máy, AI trên mạng khi cần (AI tính phí riêng, hỏi trước mỗi lần).',
download: 'Tải bộ cài',
later: 'Để sau',
never: 'Không hỏi lại trên máy này',
ask: 'Xin Quản trị cho phép',
asked: 'Đã xin – chờ Quản trị duyệt.',
denied: 'Quản trị chưa cho phép cài trên máy này. Vẫn làm video bằng AI trên mạng được (tính phí riêng, hỏi trước mỗi lần).',
onlyMine: 'Máy dựng cài trên máy này chỉ làm video của riêng anh/chị.',
afterDl: 'Đã chọn "Dựng trên máy" cho máy này. Giải nén bộ cài, bấm "Cai dat voi 1 click", rồi mở app › Video › "Liên kết máy dựng với tài khoản".',
adminTitle: 'Máy dựng video của nhân viên',
allowLabel: 'Cho phép nhân viên cài máy dựng',
allowHelp: 'Bật: người có quyền "Video & Ý tưởng" tự cài bộ tạo video trên máy của mình (máy dựng chỉ làm video của chính người đó). Tắt: người đó bấm "Xin Quản trị cho phép", anh/chị duyệt từng người.'
};
const _oc = (_or) => !!_or && typeof _or === 'object' && !Array.isArray(_or);
export function readJSON(storage, key) { try { const _or = storage && storage.getItem(key); return _or ? JSON.parse(_or) : null; } catch { return null; } }
export function writeJSON(storage, key, _or) { try { if (storage) storage.setItem(key, JSON.stringify(_or)); return true; } catch { return false; } }
export function cachedTier(storage, now = Date.now()) {
const _or = readJSON(storage, HW_KEY);
return _oc(_or) && typeof _or.tier === 'string' && Number(_or.at) > 0 && now - Number(_or.at) < HW_TTL && now >= Number(_or.at) ? _or.tier : null;
}
export function saveTier(storage, tier, now = Date.now()) { return writeJSON(storage, HW_KEY, { tier: String(tier || 'unknown'), at: now }); }
export function snoozed(storage, now = Date.now()) {
const _or = readJSON(storage, SNOOZE_KEY);
return !!(_oc(_or) && (_or.never === true || Number(_or.until) > now));
}
export function snooze(storage, { never = false, now = Date.now() } = {}) { return writeJSON(storage, SNOOZE_KEY, never ? { never: true, at: now } : { until: now + SNOOZE_MS, at: now }); }
export function suggestLevel({ company = false, owner = false, video = false, engineLinked = false, mode = 'machine', tier = null, isSnoozed = false } = {}) {
if (!company || owner || !video || isSnoozed) return null;
if (engineLinked && mode !== 'off' && mode !== 'online') return null;
if (tier === 'manh') return 'strong';
if (tier === 'kha') return 'soft';
return null;
}
export function primaryAction(st = {}) {
if (st.allowed) return 'download';
if (st.state === 'pending') return 'asked';
if (st.state === 'denied') return 'denied';
return 'ask';
}
export function memberVideoMode({ company = false, owner = false, engine = null } = {}) {
if (!company || owner) return null;
const e = _oc(engine) ? engine : {};
if (e.linked && e.online) return { mode: 'machine', sendOwn: true, label: 'Máy dựng của bạn đang bật' };
if (e.linked) return { mode: 'online', sendOwn: true, label: 'Máy dựng của bạn đang tắt' };
return { mode: 'online', sendOwn: false, label: 'Chưa liên kết máy dựng của bạn' };
}
export function adminNotice(it = {}) {
const _os = (it.name || 'Nhân viên') + ' (' + (it.dept || 'chưa chọn phòng') + ')';
if (it.st === 'pending') return _os + ' xin cài bộ tạo video trên máy của mình';
return _os + ' có máy đủ mạnh để làm video – đã gợi ý cài';
}
export function adminUnseen(items = []) { return (items || []).filter((it) => it && !it.seen && (it.told || it.st === 'pending')); }
function _o4() { try { ensureCss(new URL('./video_machine.8f2350a459.css', import.meta.url).href, 'bds-vm-css'); } catch { } }
const _on = () => { try { return typeof localStorage !== 'undefined' ? localStorage : null; } catch { return null; } };
function downloadLinks(ui, { onPick } = {}) {
const { h } = ui;
const _o7 = engineDownload(typeof navigator !== 'undefined' ? navigator : null);
const _o0 = (d, main) => {
const _o8 = h('a', { class: main ? 'btn btn-primary' : 'btn btn-ghost btn-sm', href: d.path, download: d.file, 'data-testid': main ? 'vm-download' : 'vm-download-other', dataset: { os: d.os } },
ui.icon('download', main ? 20 : 18), h('span', null, main ? TEXT.download + ' (' + d.label + ')' : 'Máy ' + d.label + '? Tải cho ' + d.label));
_o8.addEventListener('click', () => { if (onPick) onPick(d); });
return _o8;
};
return [_o0(_o7.primary, true), _o0(_o7.other, false)];
}
export function installVideoMachine({ S, ui, runCheck = null, delay = 1200 } = {}) {
const _oo = _on();
let card = null, stopped = false;
const api = (_o0, p) => S.api.call(_o0, p || {});
const company = () => !!(S.status && S.status.edition === 'cong-ty');
const owner = () => !!(S.user && S.user.role === 'owner');
const _ob = () => !!(S.user && S.user.perms && S.user.perms.video === true);
const _oe = () => { try { return S.video && typeof S.video.mode === 'function' ? S.video.mode() : (S.video && S.video.hidden && S.video.hidden() ? 'off' : 'machine'); } catch { return 'machine'; } };
const close = () => { if (card) { card.remove(); card = null; } };
async function _op() {
const _o3 = cachedTier(_oo);
if (_o3) return _o3;
let tier = 'unknown';
try {
const run = runCheck || (await import('./wizard/hwcheck.js')).runCheck;
const _o9 = run();
tier = (_o9 && _o9.tier) || 'unknown';
} catch { tier = 'unknown'; }
saveTier(_oo, tier);
return tier;
}
function _om(level, st, tier) {
const { h, button, toast } = ui;
_o4(); close();
const strong = level === 'strong';
const body = h('div', { class: 'vm-acts btn-row' });
const _og = h('p', { class: 'muted small', 'data-testid': 'vm-note', 'aria-live': 'polite' });
const _oi = (s) => {
const act = primaryAction(s);
const _o1 = [];
if (act === 'download') _o1.push(...downloadLinks(ui, { onPick: async () => {
try { if (S.video && typeof S.video.setMode === 'function') await S.video.setMode('machine', 'vm_suggest'); } catch { }
_og.textContent = TEXT.afterDl;
} }));
else if (act === 'ask') _o1.push(button(TEXT.ask, async () => {
try { const _oj = await api('vm.request', {}); _oi((_oj && _oj.state) || { ...s, state: 'pending' }); toast('Đã gửi lời xin tới Quản trị', 'ok'); } catch (e) { toast((e && (e.userMessage || e.message)) || 'Chưa gửi được', 'warn'); }
}, { kind: 'primary', icon: 'shield', testid: 'vm-ask' }));
else _og.textContent = act === 'asked' ? TEXT.asked : TEXT.denied;
_o1.push(button(TEXT.later, () => { snooze(_oo); close(); }, { kind: 'ghost', icon: 'clock', testid: 'vm-later' }));
_o1.push(button(TEXT.never, () => { snooze(_oo, { never: true }); close(); }, { kind: 'ghost', icon: 'x', testid: 'vm-never', small: true }));
ui.mountTo(body, _o1);
if (act === 'download' && !_og.textContent) _og.textContent = TEXT.onlyMine;
};
card = h('section', { class: 'card vm-card' + (strong ? ' vm-strong' : ' vm-soft'), role: 'region', 'aria-label': strong ? TEXT.strongTitle : TEXT.softTitle, 'data-testid': 'vm-card', dataset: { level, tier } },
h('div', { class: 'card-body' },
h('div', { class: 'vm-head' }, h('span', { class: 'vm-ico', 'aria-hidden': 'true' }, ui.icon('chip', 22)), h('strong', null, strong ? TEXT.strongTitle : TEXT.softTitle),
button('', () => { snooze(_oo); close(); }, { kind: 'ghost', icon: 'close', title: 'Đóng', small: true, testid: 'vm-close' })),
h('p', { 'data-testid': 'vm-text' }, strong ? TEXT.strong : TEXT.soft),
body, _og));
_oi(st);
document.body.appendChild(card);
}
async function _od() {
if (!_ob() || snoozed(_oo)) return;
const tier = await _op();
if (!TIERS_OK.includes(tier) || stopped) return;
let st;
try { st = await api('vm.status', {}); } catch { return; }
if (!st || stopped) return;
const level = suggestLevel({ company: !!st.company, owner: !!st.owner, video: !!st.video, engineLinked: !!(st.engine && st.engine.linked), mode: _oe(), tier, isSnoozed: snoozed(_oo) });
if (!level) return;
_om(level, st, tier);
const told = readJSON(_oo, TOLD_KEY) || {};
const uid = (S.user && S.user.id) || '';
if (told[uid] !== tier) { try { await api('vm.suggested', { tier }); told[uid] = tier; writeJSON(_oo, TOLD_KEY, told); } catch { } }
}
async function _o2() {
let _oj;
try { _oj = await api('vm.admin_list', {}); } catch { return; }
const list = adminUnseen(_oj && _oj.items);
if (!list.length || stopped) return;
const { h, button, toast } = ui;
_o4(); close();
const it = list[0];
const _o6 = async (allow) => {
try {
if (allow === null) await api('vm.seen', { user_ids: [it.user_id] });
else { await api('vm.decide', { user_id: it.user_id, allow }); toast(allow ? 'Đã cho phép ' + it.name + ' cài máy dựng' : 'Đã không cho ' + it.name + ' cài máy dựng', 'ok'); }
} catch (e) { toast((e && (e.userMessage || e.message)) || 'Chưa lưu được', 'warn'); return; }
close(); if (list.length > 1) setTimeout(_o2, 300);
};
card = h('section', { class: 'card vm-card vm-admin', role: 'region', 'aria-label': TEXT.adminTitle, 'data-testid': 'vm-admin-card', dataset: { user: it.user_id } },
h('div', { class: 'card-body' },
h('div', { class: 'vm-head' }, h('span', { class: 'vm-ico', 'aria-hidden': 'true' }, ui.icon('chip', 22)), h('strong', null, TEXT.adminTitle)),
h('p', { 'data-testid': 'vm-admin-text' }, adminNotice(it)),
h('p', { class: 'muted small' }, it.allowed ? 'Đang được cài (theo "' + TEXT.allowLabel + '"). Máy dựng của người này chỉ làm video của chính người đó.' : 'Người này cần anh/chị cho phép mới cài được.'),
h('div', { class: 'btn-row' },
button('Cho phép', () => _o6(true), { kind: 'primary', icon: 'check', testid: 'vm-admin-allow' }),
button('Không cho', () => _o6(false), { kind: 'secondary', icon: 'x', testid: 'vm-admin-deny' }),
button('Đã xem', () => _o6(null), { kind: 'ghost', icon: 'clock', testid: 'vm-admin-seen' }))));
document.body.appendChild(card);
}
const _oq = setTimeout(() => {
if (stopped || !S.user || !S.api || !company()) return;
(owner() ? _o2() : _od()).catch(() => { });
}, delay);
return { stop() { stopped = true; clearTimeout(_oq); close(); }, run: () => (owner() ? _o2() : _od()), close };
}
export async function renderOrgPanel(box, { ui, api, onChange, offered = false } = {}) {
_o4();
const { h, button, field, badge, toast } = ui;
let _oh = null, vm = null;
try { [_oh, vm] = await Promise.all([api.call('org.depts', {}), api.call('vm.admin_list', {}).catch(() => null)]); } catch (e) {
ui.mountTo(box, h('p', { class: 'muted small' }, e && e.code === 'UNKNOWN_ACTION' ? 'Máy chủ bản cũ chưa có "Phòng ban" – cập nhật máy chủ.' : (e && (e.userMessage || e.message)) || ''));
return;
}
const _ok = () => renderOrgPanel(box, { ui, api, onChange, offered });
const newDept = field({ label: 'Thêm phòng', id: 'dept-new', placeholder: 'vd Phòng Dự án', autocomplete: 'off' });
newDept.input.setAttribute('data-testid', 'dept-new');
const chips = h('div', { class: 'chips', 'data-testid': 'dept-list' }, (_oh.names || []).map((_of) => h('span', { class: 'vm-dept' }, badge(_of, (_oh.base || []).includes(_of) ? 'info' : 'neutral'),
(_oh.custom || []).includes(_of) ? button('', async () => {
if (!(await ui.confirm('Xoá phòng "' + _of + '"? Người và nhóm đang ở phòng này về "Chưa chọn phòng".', { ok: 'Xoá phòng', title: 'Xoá phòng' }))) return;
await api.call('org.dept_remove', { name: _of }); toast('Đã xoá phòng', 'ok'); _ok(); if (onChange) onChange();
}, { kind: 'ghost', small: true, icon: 'x', title: 'Xoá phòng ' + _of, testid: 'dept-del-' + _of }) : null)));
const parts = [
h('h4', { class: 'section-title' }, 'Phòng ban'),
h('p', { class: 'muted small' }, 'Gom người theo phòng (Kinh doanh, Marketing, Hành chính hoặc tên tự đặt). Nhóm sale ở Kho lead thuộc một phòng. Quyền vẫn tick ở từng người – phòng chỉ để gom người.'),
chips,
h('div', { class: 'btn-row' }, newDept, button('Thêm phòng', async () => {
const _of = String(newDept.getValue() || '').trim(); if (!_of) return;
await api.call('org.dept_add', { name: _of }); toast('Đã thêm phòng ' + _of, 'ok'); _ok();
}, { kind: 'secondary', icon: 'plus', testid: 'dept-add' }))
];
if (vm && vm.company && offered) {
const sw = field({ label: TEXT.allowLabel, type: 'toggle', value: vm.allow !== false, id: 'vm-allow',
onChange: async (_or) => { try { await api.call('vm.config', { allow: !!_or }); toast('Đã lưu', 'ok'); } catch (e) { toast((e && (e.userMessage || e.message)) || 'Chưa lưu được', 'warn'); } } });
sw.input.setAttribute('data-testid', 'vm-allow');
const _ol = (vm.items || []).map((it) => h('div', { class: 'row-main', 'data-testid': 'vm-row-' + it.user_id },
h('div', { class: 'row-text' }, h('strong', null, it.name), h('span', { class: 'muted small' }, [it.dept || 'Chưa chọn phòng', it.tier ? 'máy ' + (it.tier === 'manh' ? 'Mạnh' : 'Khá') : '',
it.st === 'pending' ? 'đang xin phép' : it.st === 'approved' ? 'đã cho phép' : it.st === 'denied' ? 'không cho' : '',
it.engines.length ? it.engines.map((e) => 'Máy dựng của ' + it.name + (e.online ? ' đang bật' : ' đang tắt')).join(', ') : 'chưa liên kết máy dựng'].filter(Boolean).join(' · '))),
h('div', { class: 'btn-row' },
it.st !== 'approved' ? button('Cho phép', async () => { await api.call('vm.decide', { user_id: it.user_id, allow: true }); toast('Đã cho phép', 'ok'); _ok(); }, { kind: 'secondary', small: true, icon: 'check', testid: 'vm-allow-' + it.user_id }) : null,
it.st !== 'denied' ? button('Không cho', async () => { await api.call('vm.decide', { user_id: it.user_id, allow: false }); toast('Đã không cho – vé máy dựng của người này đã thu hồi', 'ok'); _ok(); }, { kind: 'ghost', small: true, icon: 'x', testid: 'vm-deny-' + it.user_id }) : null,
...it.engines.map((e) => button('Thu hồi máy dựng', async () => { await api.call('devices.revoke', { device_id: e.id }); toast('Đã thu hồi', 'ok'); _ok(); }, { kind: 'ghost', small: true, icon: 'lock', testid: 'vm-revoke-' + e.id })))));
parts.push(h('h4', { class: 'section-title' }, TEXT.adminTitle), sw, h('p', { class: 'muted small' }, TEXT.allowHelp),
_ol.length ? h('div', { class: 'list', 'data-testid': 'vm-rows' }, _ol) : h('p', { class: 'muted small' }, 'Chưa có nhân viên nào được gợi ý hoặc xin cài máy dựng.'));
}
ui.mountTo(box, h('div', { class: 'sub-block vm-org', 'data-testid': 'org-panel' }, ...parts));
}
export async function memberDeptField(box, { ui, api, user: u, onSaved } = {}) {
let _oh;
try { _oh = await api.call('org.depts', {}); } catch { return; }
const _o5 = (_oh.members && _oh.members[u.id]) || '';
const _oa = ui.field({ label: 'Phòng', type: 'select', value: _o5, id: 'user-dept', options: [{ value: '', label: 'Chưa chọn phòng' }, ...(_oh.names || []).map((_of) => ({ value: _of, label: _of }))],
onChange: async (_or) => {
try { await api.call('org.dept_set', { user_id: u.id, dept: _or }); ui.toast('Đã chuyển ' + (u.full_name || u.username) + ' sang ' + (_or || 'Chưa chọn phòng'), 'ok'); if (onSaved) await onSaved(); }
catch (e) { ui.toast((e && (e.userMessage || e.message)) || 'Chưa lưu được', 'warn'); }
} });
_oa.setAttribute && _oa.setAttribute('data-testid', 'user-dept-field');
ui.mountTo(box, _oa);
}
export default { HW_KEY, SNOOZE_KEY, HW_TTL, SNOOZE_MS, TEXT, cachedTier, saveTier, snoozed, snooze, suggestLevel, primaryAction, memberVideoMode, adminNotice, adminUnseen, installVideoMachine, renderOrgPanel, memberDeptField };

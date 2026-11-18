import { engineDownload } from './engine_dl.18c8a720c5.js';
import { ensureCss } from './xkit.f03faf0986.js';
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
const _od = (_os) => !!_os && typeof _os === 'object' && !Array.isArray(_os);
export function readJSON(storage, key) { try { const _os = storage && storage.getItem(key); return _os ? JSON.parse(_os) : null; } catch { return null; } }
export function writeJSON(storage, key, _os) { try { if (storage) storage.setItem(key, JSON.stringify(_os)); return true; } catch { return false; } }
export function cachedTier(storage, now = Date.now()) {
const _os = readJSON(storage, HW_KEY);
return _od(_os) && typeof _os.tier === 'string' && Number(_os.at) > 0 && now - Number(_os.at) < HW_TTL && now >= Number(_os.at) ? _os.tier : null;
}
export function saveTier(storage, tier, now = Date.now()) { return writeJSON(storage, HW_KEY, { tier: String(tier || 'unknown'), at: now }); }
export function snoozed(storage, now = Date.now()) {
const _os = readJSON(storage, SNOOZE_KEY);
return !!(_od(_os) && (_os.never === true || Number(_os.until) > now));
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
const e = _od(engine) ? engine : {};
if (e.linked && e.online) return { mode: 'machine', sendOwn: true, label: 'Máy dựng của bạn đang bật' };
if (e.linked) return { mode: 'online', sendOwn: true, label: 'Máy dựng của bạn đang tắt' };
return { mode: 'online', sendOwn: false, label: 'Chưa liên kết máy dựng của bạn' };
}
export function adminNotice(it = {}) {
const _ot = (it.name || 'Nhân viên') + ' (' + (it.dept || 'chưa chọn phòng') + ')';
if (it.st === 'pending') return _ot + ' xin cài bộ tạo video trên máy của mình';
return _ot + ' có máy đủ mạnh để làm video – đã gợi ý cài';
}
export function adminUnseen(items = []) { return (items || []).filter((it) => it && !it.seen && (it.told || it.st === 'pending')); }
function _o5() { try { ensureCss(new URL('./video_machine.8f2350a459.css', import.meta.url).href, 'bds-vm-css'); } catch { } }
const _oo = () => { try { return typeof localStorage !== 'undefined' ? localStorage : null; } catch { return null; } };
function downloadLinks(ui, { onPick } = {}) {
const { h } = ui;
const _o8 = engineDownload(typeof navigator !== 'undefined' ? navigator : null);
const _o0 = (d, main) => {
const _o9 = h('a', { class: main ? 'btn btn-primary' : 'btn btn-ghost btn-sm', href: d.path, download: d.file, 'data-testid': main ? 'vm-download' : 'vm-download-other', dataset: { os: d.os } },
ui.icon('download', main ? 20 : 18), h('span', null, main ? TEXT.download + ' (' + d.label + ')' : 'Máy ' + d.label + '? Tải cho ' + d.label));
_o9.addEventListener('click', () => { if (onPick) onPick(d); });
return _o9;
};
return [_o0(_o8.primary, true), _o0(_o8.other, false)];
}
export function installVideoMachine({ S, ui, runCheck = null, delay = 1200 } = {}) {
const _op = _oo();
let card = null, stopped = false;
const api = (_o0, p) => S.api.call(_o0, p || {});
const company = () => !!(S.status && S.status.edition === 'cong-ty');
const owner = () => !!(S.user && S.user.role === 'owner');
const _oc = () => !!(S.user && S.user.perms && S.user.perms.video === true);
const _of = () => { try { return S.video && typeof S.video.mode === 'function' ? S.video.mode() : (S.video && S.video.hidden && S.video.hidden() ? 'off' : 'machine'); } catch { return 'machine'; } };
const close = () => { if (card) { card.remove(); card = null; } };
async function _oq() {
const _o4 = cachedTier(_op);
if (_o4) return _o4;
let tier = 'unknown';
try {
const run = runCheck || (await import('./wizard/hwcheck.js')).runCheck;
const _oa = run();
tier = (_oa && _oa.tier) || 'unknown';
} catch { tier = 'unknown'; }
saveTier(_op, tier);
return tier;
}
function _on(level, st, tier) {
const { h, button, toast } = ui;
_o5(); close();
const strong = level === 'strong';
const body = h('div', { class: 'vm-acts btn-row' });
const _oh = h('p', { class: 'muted small', 'data-testid': 'vm-note', 'aria-live': 'polite' });
const _oj = (s) => {
const _o1 = primaryAction(s);
const _o2 = [];
if (_o1 === 'download') _o2.push(...downloadLinks(ui, { onPick: async () => {
try { if (S.video && typeof S.video.setMode === 'function') await S.video.setMode('machine', 'vm_suggest'); } catch { }
_oh.textContent = TEXT.afterDl;
} }));
else if (_o1 === 'ask') _o2.push(button(TEXT.ask, async () => {
try { const _ok = await api('vm.request', {}); _oj((_ok && _ok.state) || { ...s, state: 'pending' }); toast('Đã gửi lời xin tới Quản trị', 'ok'); } catch (e) { toast((e && (e.userMessage || e.message)) || 'Chưa gửi được', 'warn'); }
}, { kind: 'primary', icon: 'shield', testid: 'vm-ask' }));
else _oh.textContent = _o1 === 'asked' ? TEXT.asked : TEXT.denied;
_o2.push(button(TEXT.later, () => { snooze(_op); close(); }, { kind: 'ghost', icon: 'clock', testid: 'vm-later' }));
_o2.push(button(TEXT.never, () => { snooze(_op, { never: true }); close(); }, { kind: 'ghost', icon: 'x', testid: 'vm-never', small: true }));
ui.mountTo(body, _o2);
if (_o1 === 'download' && !_oh.textContent) _oh.textContent = TEXT.onlyMine;
};
card = h('section', { class: 'card vm-card' + (strong ? ' vm-strong' : ' vm-soft'), role: 'region', 'aria-label': strong ? TEXT.strongTitle : TEXT.softTitle, 'data-testid': 'vm-card', dataset: { level, tier } },
h('div', { class: 'card-body' },
h('div', { class: 'vm-head' }, h('span', { class: 'vm-ico', 'aria-hidden': 'true' }, ui.icon('chip', 22)), h('strong', null, strong ? TEXT.strongTitle : TEXT.softTitle),
button('', () => { snooze(_op); close(); }, { kind: 'ghost', icon: 'close', title: 'Đóng', small: true, testid: 'vm-close' })),
h('p', { 'data-testid': 'vm-text' }, strong ? TEXT.strong : TEXT.soft),
body, _oh));
_oj(st);
document.body.appendChild(card);
}
async function _oe() {
if (!_oc() || snoozed(_op)) return;
const tier = await _oq();
if (!TIERS_OK.includes(tier) || stopped) return;
let st;
try { st = await api('vm.status', {}); } catch { return; }
if (!st || stopped) return;
const level = suggestLevel({ company: !!st.company, owner: !!st.owner, video: !!st.video, engineLinked: !!(st.engine && st.engine.linked), mode: _of(), tier, isSnoozed: snoozed(_op) });
if (!level) return;
_on(level, st, tier);
const told = readJSON(_op, TOLD_KEY) || {};
const uid = (S.user && S.user.id) || '';
if (told[uid] !== tier) { try { await api('vm.suggested', { tier }); told[uid] = tier; writeJSON(_op, TOLD_KEY, told); } catch { } }
}
async function _o3() {
let _ok;
try { _ok = await api('vm.admin_list', {}); } catch { return; }
const list = adminUnseen(_ok && _ok.items);
if (!list.length || stopped) return;
const { h, button, toast } = ui;
_o5(); close();
const it = list[0];
const _o7 = async (allow) => {
try {
if (allow === null) await api('vm.seen', { user_ids: [it.user_id] });
else { await api('vm.decide', { user_id: it.user_id, allow }); toast(allow ? 'Đã cho phép ' + it.name + ' cài máy dựng' : 'Đã không cho ' + it.name + ' cài máy dựng', 'ok'); }
} catch (e) { toast((e && (e.userMessage || e.message)) || 'Chưa lưu được', 'warn'); return; }
close(); if (list.length > 1) setTimeout(_o3, 300);
};
card = h('section', { class: 'card vm-card vm-admin', role: 'region', 'aria-label': TEXT.adminTitle, 'data-testid': 'vm-admin-card', dataset: { user: it.user_id } },
h('div', { class: 'card-body' },
h('div', { class: 'vm-head' }, h('span', { class: 'vm-ico', 'aria-hidden': 'true' }, ui.icon('chip', 22)), h('strong', null, TEXT.adminTitle)),
h('p', { 'data-testid': 'vm-admin-text' }, adminNotice(it)),
h('p', { class: 'muted small' }, it.allowed ? 'Đang được cài (theo "' + TEXT.allowLabel + '"). Máy dựng của người này chỉ làm video của chính người đó.' : 'Người này cần anh/chị cho phép mới cài được.'),
h('div', { class: 'btn-row' },
button('Cho phép', () => _o7(true), { kind: 'primary', icon: 'check', testid: 'vm-admin-allow' }),
button('Không cho', () => _o7(false), { kind: 'secondary', icon: 'x', testid: 'vm-admin-deny' }),
button('Đã xem', () => _o7(null), { kind: 'ghost', icon: 'clock', testid: 'vm-admin-seen' }))));
document.body.appendChild(card);
}
const _or = setTimeout(() => {
if (stopped || !S.user || !S.api || !company()) return;
(owner() ? _o3() : _oe()).catch(() => { });
}, delay);
return { stop() { stopped = true; clearTimeout(_or); close(); }, run: () => (owner() ? _o3() : _oe()), close };
}
export async function renderOrgPanel(box, { ui, api, onChange, offered = false } = {}) {
_o5();
const { h, button, field, badge, toast } = ui;
let _oi = null, vm = null;
try { [_oi, vm] = await Promise.all([api.call('org.depts', {}), api.call('vm.admin_list', {}).catch(() => null)]); } catch (e) {
ui.mountTo(box, h('p', { class: 'muted small' }, e && e.code === 'UNKNOWN_ACTION' ? 'Máy chủ bản cũ chưa có "Phòng ban" – cập nhật máy chủ.' : (e && (e.userMessage || e.message)) || ''));
return;
}
const _ol = () => renderOrgPanel(box, { ui, api, onChange, offered });
const newDept = field({ label: 'Thêm phòng', id: 'dept-new', placeholder: 'vd Phòng Dự án', autocomplete: 'off' });
newDept.input.setAttribute('data-testid', 'dept-new');
const chips = h('div', { class: 'chips', 'data-testid': 'dept-list' }, (_oi.names || []).map((_og) => h('span', { class: 'vm-dept' }, badge(_og, (_oi.base || []).includes(_og) ? 'info' : 'neutral'),
(_oi.custom || []).includes(_og) ? button('', async () => {
if (!(await ui.confirm('Xoá phòng "' + _og + '"? Người và nhóm đang ở phòng này về "Chưa chọn phòng".', { ok: 'Xoá phòng', title: 'Xoá phòng' }))) return;
await api.call('org.dept_remove', { name: _og }); toast('Đã xoá phòng', 'ok'); _ol(); if (onChange) onChange();
}, { kind: 'ghost', small: true, icon: 'x', title: 'Xoá phòng ' + _og, testid: 'dept-del-' + _og }) : null)));
const parts = [
h('h4', { class: 'section-title' }, 'Phòng ban'),
h('p', { class: 'muted small' }, 'Gom người theo phòng (Kinh doanh, Marketing, Hành chính hoặc tên tự đặt). Nhóm sale ở Kho lead thuộc một phòng. Quyền vẫn tick ở từng người – phòng chỉ để gom người.'),
chips,
h('div', { class: 'btn-row' }, newDept, button('Thêm phòng', async () => {
const _og = String(newDept.getValue() || '').trim(); if (!_og) return;
await api.call('org.dept_add', { name: _og }); toast('Đã thêm phòng ' + _og, 'ok'); _ol();
}, { kind: 'secondary', icon: 'plus', testid: 'dept-add' }))
];
if (vm && vm.company && offered) {
const sw = field({ label: TEXT.allowLabel, type: 'toggle', value: vm.allow !== false, id: 'vm-allow',
onChange: async (_os) => { try { await api.call('vm.config', { allow: !!_os }); toast('Đã lưu', 'ok'); } catch (e) { toast((e && (e.userMessage || e.message)) || 'Chưa lưu được', 'warn'); } } });
sw.input.setAttribute('data-testid', 'vm-allow');
const _om = (vm.items || []).map((it) => h('div', { class: 'row-main', 'data-testid': 'vm-row-' + it.user_id },
h('div', { class: 'row-text' }, h('strong', null, it.name), h('span', { class: 'muted small' }, [it.dept || 'Chưa chọn phòng', it.tier ? 'máy ' + (it.tier === 'manh' ? 'Mạnh' : 'Khá') : '',
it.st === 'pending' ? 'đang xin phép' : it.st === 'approved' ? 'đã cho phép' : it.st === 'denied' ? 'không cho' : '',
it.engines.length ? it.engines.map((e) => 'Máy dựng của ' + it.name + (e.online ? ' đang bật' : ' đang tắt')).join(', ') : 'chưa liên kết máy dựng'].filter(Boolean).join(' · '))),
h('div', { class: 'btn-row' },
it.st !== 'approved' ? button('Cho phép', async () => { await api.call('vm.decide', { user_id: it.user_id, allow: true }); toast('Đã cho phép', 'ok'); _ol(); }, { kind: 'secondary', small: true, icon: 'check', testid: 'vm-allow-' + it.user_id }) : null,
it.st !== 'denied' ? button('Không cho', async () => { await api.call('vm.decide', { user_id: it.user_id, allow: false }); toast('Đã không cho – vé máy dựng của người này đã thu hồi', 'ok'); _ol(); }, { kind: 'ghost', small: true, icon: 'x', testid: 'vm-deny-' + it.user_id }) : null,
...it.engines.map((e) => button('Thu hồi máy dựng', async () => { await api.call('devices.revoke', { device_id: e.id }); toast('Đã thu hồi', 'ok'); _ol(); }, { kind: 'ghost', small: true, icon: 'lock', testid: 'vm-revoke-' + e.id })))));
parts.push(h('h4', { class: 'section-title' }, TEXT.adminTitle), sw, h('p', { class: 'muted small' }, TEXT.allowHelp),
_om.length ? h('div', { class: 'list', 'data-testid': 'vm-rows' }, _om) : h('p', { class: 'muted small' }, 'Chưa có nhân viên nào được gợi ý hoặc xin cài máy dựng.'));
}
ui.mountTo(box, h('div', { class: 'sub-block vm-org', 'data-testid': 'org-panel' }, ...parts));
}
export async function memberDeptField(box, { ui, api, user: u, onSaved } = {}) {
let _oi;
try { _oi = await api.call('org.depts', {}); } catch { return; }
const _o6 = (_oi.members && _oi.members[u.id]) || '';
const _ob = ui.field({ label: 'Phòng', type: 'select', value: _o6, id: 'user-dept', options: [{ value: '', label: 'Chưa chọn phòng' }, ...(_oi.names || []).map((_og) => ({ value: _og, label: _og }))],
onChange: async (_os) => {
try { await api.call('org.dept_set', { user_id: u.id, dept: _os }); ui.toast('Đã chuyển ' + (u.full_name || u.username) + ' sang ' + (_os || 'Chưa chọn phòng'), 'ok'); if (onSaved) await onSaved(); }
catch (e) { ui.toast((e && (e.userMessage || e.message)) || 'Chưa lưu được', 'warn'); }
} });
_ob.setAttribute && _ob.setAttribute('data-testid', 'user-dept-field');
ui.mountTo(box, _ob);
}
export default { HW_KEY, SNOOZE_KEY, HW_TTL, SNOOZE_MS, TEXT, cachedTier, saveTier, snoozed, snooze, suggestLevel, primaryAction, memberVideoMode, adminNotice, adminUnseen, installVideoMachine, renderOrgPanel, memberDeptField };

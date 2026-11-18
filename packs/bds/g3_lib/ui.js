import { kit, h, selftestCommon } from '../_lib/kit.js';
import { parseData } from '../_lib/crm.js';
const _o0 = `
.g3{display:flex;flex-direction:column;gap:12px;min-width:0}
.g3 h2{margin:0;font-size:1.2rem}.g3 h3{margin:0;font-size:1rem}
.g3-sub{color:rgba(127,127,127,.95);font-size:.88rem;margin:0}
.g3-tabs{display:flex;gap:6px;flex-wrap:wrap}
.g3-tabs button{min-height:44px;padding:0 14px;border-radius:999px;border:1px solid rgba(127,127,127,.3);background:transparent;color:inherit;font:inherit;cursor:pointer}
.g3-tabs button.on{background:var(--navy,#0F1E33);color:#fff;border-color:var(--navy,#0F1E33)}
.g3-row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.g3-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px}
.g3-kpi{border:1px solid rgba(127,127,127,.25);border-radius:12px;padding:10px;min-width:0}.g3-kpi b{display:block;font-size:1.15rem}.g3-kpi small{color:rgba(127,127,127,.95)}
.g3-item{border:1px solid rgba(127,127,127,.25);border-radius:12px;padding:10px 12px;display:flex;flex-direction:column;gap:6px;min-width:0}
.g3-item .g3-row{justify-content:space-between}
.g3-f{display:flex;flex-direction:column;gap:4px;font-size:.9rem;min-width:0}
.g3-f input,.g3-f textarea,.g3-f select{min-height:44px;padding:8px 10px;border-radius:10px;border:1px solid rgba(127,127,127,.3);background:transparent;color:inherit;font:inherit;font-size:max(1rem,16px);width:100%;box-sizing:border-box;min-width:0}
.g3 input[type=file],.sheet input[type=file]{min-height:44px;padding:9px 0;max-width:100%}
.btn.g3-btn{white-space:normal;text-align:left;line-height:1.3;padding-top:8px;padding-bottom:8px}.btn.g3-btn span{overflow:visible;text-overflow:clip}
.g3-follow{display:flex;flex-direction:column;align-items:flex-start;gap:6px}
.g3 summary,.sheet details>summary{min-height:44px;display:flex;align-items:center;cursor:pointer}
.g3-f textarea{min-height:90px}
.g3-two{display:grid;grid-template-columns:1fr;gap:8px}@media(min-width:700px){.g3-two{grid-template-columns:1fr 1fr}}
.g3-tbl{width:100%;border-collapse:collapse;font-size:.88rem}.g3-tbl th,.g3-tbl td{padding:6px 8px;border-bottom:1px solid rgba(127,127,127,.2);text-align:left;vertical-align:top}.g3-tbl td.n,.g3-tbl th.n{text-align:right;white-space:nowrap}
.g3-scroll{overflow-x:auto;max-width:100%}
.g3-pre{white-space:pre-wrap;word-break:break-word;font-size:.82rem;background:rgba(127,127,127,.08);border-radius:10px;padding:10px;margin:0;max-height:320px;overflow:auto}
.g3-ok{color:#1a7f37}.g3-warn{color:#9a6700}.g3-fail{color:#b42318}.g3-manual{color:#57606a}
.g3-note{border-left:4px solid var(--gold,#C9A24A);padding:8px 12px;background:rgba(201,162,74,.10);border-radius:8px;font-size:.88rem}
.g3-chk{display:flex;gap:8px;align-items:flex-start;min-height:44px}.g3-chk.g3-day{align-items:center;min-width:56px}.g3-chk input{width:22px;height:22px;flex:none;margin-top:2px}
.g3-code{font-family:ui-monospace,Menlo,monospace;overflow-wrap:anywhere;font-size:.85rem}
`;
let _o6 = false;
export function ensureCss() {
if (_o6 || typeof document === 'undefined') return;
_o6 = true;
try { const _oc = new CSSStyleSheet(); _oc.replaceSync(_o0); document.adoptedStyleSheets = [...document.adoptedStyleSheets, _oc]; } catch { }
}
const _o1 = [
[/^\d\.\s*chép/i, 'copy'], [/^\d\.\s*mở/i, 'external'], [/^\d\.\s*đã/i, 'check'],
[/^sửa/i, '✏️'], [/^(xoá|xóa)/i, '🗑️'], [/^(tải vào|nhập\b)/i, 'up'], [/^tải/i, 'download'],
[/^(trang & link|link & theo dõi)/i, 'link'], [/^quản lý/i, 'layout'], [/^khách \(/i, 'customers'],
[/^(ngừng chia sẻ|bật chia sẻ)/i, 'eye'], [/^tạm dừng/i, '⏸️'], [/^dùng lại/i, '▶️'], [/^gắn/i, 'tag'],
[/^có mặt/i, 'check'], [/^vắng/i, 'x'], [/^hẹn/i, 'clock'], [/^nhắc/i, 'chat'], [/^chọn tất cả/i, 'check'], [/^bỏ chọn/i, 'minus'],
[/^soạn/i, 'sparkle'], [/^ai\b/i, 'sparkle'], [/^(đăng|gỡ)/i, 'send'], [/^áp/i, 'check'], [/^dùng số/i, 'check'],
];
export function g3Icon(label) { const _ob = String(label || '').trim(); for (const [re, _o7] of _o1) if (re.test(_ob)) return _o7; return undefined; }
export function g3kit(ctx) {
ensureCss();
const _o2 = kit(ctx);
const K = Object.create(_o2);
K.button = (label, onClick, opts = {}) => {
const _o7 = opts.icon || (typeof label === 'string' && !/^\+\s/.test(label) ? g3Icon(label) : undefined);
const _o4 = _o2.button(label, onClick, _o7 ? { ...opts, icon: _o7 } : opts);
if (_o4 && _o4.classList) _o4.classList.add('g3-btn');
return _o4;
};
K.linkBtn = (label, href, onClick, opts = {}) => _o2.linkBtn(label, href, onClick, opts.icon ? opts : { ...opts, icon: opts.target === '_blank' ? 'external' : 'next' });
const role = (ctx.user && ctx.user.role) || 'owner';
const G = {
K, h, role,
isOwner: role === 'owner', isStaff: role === 'owner' || role === 'manager',
async objs(kind) { return (await K.list('objects')).filter(o => o.kind === kind); },
async customers() { return (await K.list('objects')).filter(o => !o.kind || o.kind === 'customer'); },
view(o) { return { ...o, d: parseData(o.data) }; },
async save(kind, row, data) {
const _oa = { kind, ...row };
if (data !== undefined) _oa.data = JSON.stringify(data);
if (!_oa.created_at) _oa.created_at = Date.now();
return K.put('objects', _oa);
},
async remove(o) { return K.put('objects', { ...o, deleted: 1 }); },
canErase: !(ctx.user && ctx.user.perms && ctx.user.perms.erase === false),
async deleteRow(o, { title, text, after } = {}) {
const ok = await K.confirm({ title: title || 'Xoá?', text: text || 'Mục này sẽ không hiện nữa.', ok: 'Xoá', kind: 'danger', testid: 'g3-del-confirm' });
if (!ok) return false;
await G.remove(o);
if (after) { try { await after(); } catch { } }
K.toast('Đã xoá', 'success');
return true;
},
endpoint() { const _o3 = ctx.api || {}; return _o3.mode === 'gas' && _o3.url ? String(_o3.url) : ''; },
demo() { return (ctx.api || {}).mode === 'demo'; },
input(attrs = {}) { return h('input', { type: 'text', ...attrs }); },
area(attrs = {}) { return h('textarea', attrs); },
field(label, input, help) { return h('label', { class: 'g3-f' }, h('span', null, label), input, help ? h('small', { class: 'g3-sub' }, help) : null); },
head(title, sub, actions) {
return h('div', { class: 'g3-row', style: 'justify-content:space-between' }, h('div', null, h('h2', null, title, ' ', K.badge('Thử nghiệm', 'warn')), sub ? h('p', { class: 'g3-sub' }, sub) : null), actions ? h('div', { class: 'g3-row' }, actions) : null);
},
tabs(list, cur, onPick, testid) {
return h('div', { class: 'g3-tabs', role: 'tablist', 'data-testid': testid }, list.map(([k, label]) => h('button', { type: 'button', role: 'tab', class: k === cur ? 'on' : '', 'aria-selected': k === cur ? 'true' : 'false', 'data-testid': (testid || 'tab') + '-' + k, onclick: () => onPick(k) }, label)));
},
kpi(label, value, testid) { return h('div', { class: 'g3-kpi', 'data-testid': testid }, h('b', null, value), h('small', null, label)); },
note(text) { return h('div', { class: 'g3-note' }, text); },
download(name, text, mime = 'text/plain;charset=utf-8') {
try {
const _o5 = new Blob([text], { type: mime });
const _o3 = h('a', { href: URL.createObjectURL(_o5), download: name, style: 'display:none' });
document.body.appendChild(_o3); _o3.click();
setTimeout(() => { URL.revokeObjectURL(_o3.href); _o3.remove(); }, 1000);
return true;
} catch { return false; }
},
async copy(text, msg = 'Đã chép') { const ok = await K.copy(text); K.toast(ok ? msg : 'Chưa chép được – giữ và chọn để chép tay', ok ? 'success' : 'warn'); return ok; },
money(n) { return K.money(n); },
vnd(n) { return (Math.round(Number(n) || 0)).toLocaleString('vi-VN') + 'đ'; },
async agent() { const _o8 = await K.me(); const _o9 = _o8.staff ? null : await K.setting('profile', null); return { name: _o8.name || (_o9 && _o9.name) || '', phone: _o8.phone || (_o9 && _o9.phone) || '', license: (_o9 && (_o9.cchn || _o9.license)) || '' }; },
};
return G;
}
export const MKT_CFG_ID = 'g3-mkt-config';
export async function mktConfig(G) { const _oa = (await G.objs('g3_config')).find(o => o.id === MKT_CFG_ID); return { row: _oa || null, ...(_oa ? parseData(_oa.data) : {}) }; }
export async function selftestG3(ctx, render) { return selftestCommon(ctx, [], render); }
export { h, parseData };

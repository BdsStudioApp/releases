import { h } from '../_lib/kit.js';
import * as S from '../_lib/sales.js';
import * as G from '../g1_lib/logic.js';
import * as N from '../catalog/research_new_logic.js';
import { newProjectId } from '../catalog/upload_logic.js';
import { writeStructure } from '../catalog/structure_logic.js';
export const AI_NOTE = 'Thông tin AI tìm – cần kiểm lại với chủ đầu tư';
export const KEY_URL = 'https://aistudio.google.com/apikey';
const _o2 = [['', '— chưa rõ —'], ['sale', 'Đang bán'], ['soon', 'Sắp mở bán'], ['done', 'Đã bàn giao'], ['ask', 'Nhận bảng giá']];
const LABEL = { name: 'Tên dự án', dev: 'Chủ đầu tư', loc: 'Vị trí', price: 'Giá (triệu/m²)', types: 'Loại căn & diện tích', handover: 'Bàn giao dự kiến', status: 'Trạng thái' };
export function aiFields(r, name = '') {
const rows = N.reviewRows(r || {});
const pick = (_ob) => { const _o6 = rows.find((_ow) => _ow.field === _ob && _ow.ok); return _o6 ? _o6.value : null; };
const unsure = rows.filter((_o6) => !_o6.ok || _o6.fact.status !== 'grounded' || _o6.conf === 'thap').map((_o6) => _o6.field);
const sources = [], seen = new Set();
const add = (url, title) => { const _os = G.safeUrl(url); if (!_os || seen.has(_os)) return; seen.add(_os); sources.push({ url: _os, title: String(title || G.hostOf(_os) || _os).slice(0, 120) }); };
for (const _o6 of rows) { for (const _op of _o6.fact.sources || []) add(_op.url, _op.title); if (!(_o6.fact.sources || []).length) add(_o6.fact.url, G.hostOf(_o6.fact.url)); }
const types = pick('types');
return {
name: N.cleanName((r && r.official_name) || name), dev: String(pick('dev') || ''), loc: String(pick('loc') || ''), status: String(pick('status') || ''),
handover: String(pick('handover') || ''), price: Array.isArray(pick('price')) ? pick('price') : null, typesText: Array.isArray(types) ? S.typesToText(types) : '',
extra: { scale: String(pick('scale') || ''), legal: String(pick('legal') || ''), amenities: String(pick('amenities') || ''), progress: String(pick('progress') || '') },
sources, unsure: [...new Set(unsure)], rows
};
}
export const serverLookup = {
id: 'catalog.research_new',
async status(K, { hints = {} } = {}) {
const r = await K.api(N.ACTION_NEW, { name: 'du an moi', hints, estimate_only: true });
const est = (r && r.estimate) || null;
return { enabled: !!(est && est.enabled), estimate: est };
},
async find(K, name, { hints = {}, pick = null } = {}) {
const r = await K.api(N.ACTION_NEW, { name, hints, pick: pick || null });
const query = (r && r.query) || { name, hints, pick: pick || null };
const rows = N.reviewRows(r);
if (N.needPick(r, rows)) return { fields: null, sources: [], unsure: [], candidates: N.candidatesOf(r), query };
if (!rows.length) return { fields: null, sources: [], unsure: [], notFound: true, query };
const A = aiFields(r, name);
const { sources, unsure, rows: rr, ...fields } = A;
return { fields, sources, unsure, rows: rr, query };
}
};
let _o1 = serverLookup;
export function setProjectLookup(adapter) { _o1 = adapter && typeof adapter.find === 'function' && typeof adapter.status === 'function' ? adapter : serverLookup; }
export const lookupStatus = (K, opts) => _o1.status(K, opts || {});
export const lookupProject = (K, name, opts) => _o1.find(K, name, opts || {});
export function checkForm(_ov) {
const _oj = N.cleanName(_ov.name);
if (_oj.length < 2) return 'Nhập tên dự án.';
const lo = S.parseNum(_ov.lo), hi = S.parseNum(_ov.hi);
if (String(_ov.lo || '').trim() && !(lo > 0)) return 'Giá thấp phải là số (triệu/m²).';
if (isFinite(lo) && isFinite(hi) && hi < lo) return 'Giá cao phải lớn hơn hoặc bằng giá thấp.';
const t = S.parseTypesText(_ov.typesText || '');
if (t.some((_ow) => !_ow.ask && (!(_ow.a[0] > 0) || _ow.a[1] < _ow.a[0]))) return 'Diện tích loại căn chưa đúng – ví dụ "2PN: 65-75".';
if (_ov.handover && !/^\d{4}-\d{2}$/.test(String(_ov.handover))) return 'Bàn giao ghi dạng tháng/năm.';
return '';
}
export function projectRow(_ov, ai, { now = Date.now(), by = '', query = null, ids = [] } = {}) {
const name = N.cleanName(_ov.name);
const rows = (ai && ai.rows) || [];
const { data } = N.newProjectData(rows, { now, by, query, area: (query && query.hints && query.hints.area) || '' });
const lo = S.parseNum(_ov.lo), hi = S.parseNum(_ov.hi);
data.price = isFinite(lo) && lo > 0 ? [lo, isFinite(hi) && hi >= lo ? hi : lo] : null;
data.types = S.parseTypesText(_ov.typesText || '');
data.handover = /^\d{4}-\d{2}$/.test(String(_ov.handover || '')) ? _ov.handover : null;
for (const _od of ['loc', 'status']) { const _ow = String(_ov[_od] || '').trim(); if (_ow) data[_od] = _ow.slice(0, 300); else delete data[_od]; }
const dev = String(_ov.dev || '').trim().slice(0, 120);
if (dev) data.dev = dev; else delete data.dev;
data.added = 'ai';
data.ai_review = { ...(data.ai_review || {}), note: N.AI_REVIEW_NOTE, edited: true };
const _ok = ai && ai.structure && Array.isArray(ai.structure.zones) && ai.structure.zones.length ? writeStructure(data, ai.structure) : data;
if (!rows.length && ai && Array.isArray(ai.sources)) _ok.ai_review.sources = ai.sources.filter((_ow) => G.safeUrl(_ow && _ow.url)).slice(0, 12).map((_ow) => ({ field: '', label: '', url: G.safeUrl(_ow.url), title: String(_ow.title || '').slice(0, 120), status: 'ai_only', conf: '' }));
return { id: newProjectId(name, ids), name, dev, data: JSON.stringify(_ok), deleted: 0 };
}
const _o0 = `.lai{display:flex;flex-direction:column;gap:12px;min-width:0}
.lai-row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.lai-f{display:flex;flex-direction:column;gap:4px;font-size:.9rem;min-width:0}
.lai-f input,.lai-f select,.lai-f textarea{min-height:44px;padding:8px 10px;border-radius:10px;border:1px solid rgba(127,127,127,.35);background:transparent;color:inherit;font:inherit;width:100%;box-sizing:border-box;min-width:0}
.lai-f textarea{min-height:84px}.lai-f em{font-style:normal;color:#9a6a00;font-size:.8rem}
.lai-two{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.lai-warn{border-left:4px solid #C9A24A;background:rgba(201,162,74,.14);border-radius:8px;padding:8px 12px;font-weight:600}
.lai-err{border-left:4px solid #B3261E;background:rgba(179,38,30,.08);border-radius:8px;padding:8px 12px}
.lai-ok{border-left:4px solid #1E7A4F;background:rgba(30,122,79,.08);border-radius:8px;padding:8px 12px}
.lai-src{display:flex;flex-direction:column;gap:6px;font-size:.88rem;overflow-wrap:anywhere}
.lai-src a{color:inherit}
.lai-key{border:1px solid rgba(127,127,127,.3);border-radius:14px;padding:12px;display:flex;flex-direction:column;gap:8px}
.lai-key ol{margin:0;padding-left:20px}.lai-key li{margin:4px 0}
.lai-cand{border:1px solid rgba(127,127,127,.3);border-radius:12px;padding:10px;display:flex;flex-wrap:wrap;gap:8px;align-items:center;justify-content:space-between}
.lai-cand>div{flex:1 1 200px;min-width:0;overflow-wrap:anywhere}`;
let _o5 = false;
function ensureCss() {
if (_o5 || typeof document === 'undefined') return;
_o5 = true;
try { const _oq = new CSSStyleSheet(); _oq.replaceSync(_o0); document.adoptedStyleSheets = [...document.adoptedStyleSheets, _oq]; } catch { }
}
export function openAiProject(K, ctx, opts = {}) {
ensureCss();
const _or = { est: null, busy: false, ai: null, query: null };
const _oi = h('input', { type: 'text', maxlength: 120, value: opts.name || '', placeholder: 'Ví dụ: Khu căn hộ Ven Sông', 'data-testid': 'lp-ai-name', 'aria-label': 'Tên dự án' });
const _o3 = h('input', { type: 'text', maxlength: 80, placeholder: 'Khu vực / tỉnh (không bắt buộc)', 'data-testid': 'lp-ai-area', 'aria-label': 'Khu vực' });
const _oo = K.button('Tìm thông tin', () => _on(null), { kind: 'primary', icon: 'sparkle', testid: 'lp-ai-run', aiBadge: N.FEATURE });
const keyBox = h('div', { 'aria-live': 'polite' });
const _ok = h('div', { class: 'lai', 'aria-live': 'polite' });
const _of = K.modal({ title: '＋ Thêm dự án bằng AI', testid: 'lp-ai-modal', wide: true, body: h('div', { class: 'lai' },
h('label', { class: 'lai-f' }, h('span', null, 'Tên dự án'), _oi),
h('label', { class: 'lai-f' }, h('span', null, 'Khu vực (giúp AI phân biệt dự án trùng tên)'), _o3),
h('div', { class: 'lai-row' }, _oo),
h('p', { class: 'lb-muted' }, 'AI tìm trên Google: chủ đầu tư, vị trí, giá, loại căn, bàn giao – kèm link nguồn. Anh/chị sửa lại rồi mới lưu.'),
keyBox, _ok) });
const hints = () => ({ area: N.cleanName(_o3.value).slice(0, 80), dev: '' });
async function estimate() {
try {
const r = await lookupStatus(K, { hints: hints() });
_or.est = { ...((r && r.estimate) || {}), enabled: !!(r && r.enabled) };
} catch (e) {
_or.est = null;
if (e && e.code === 'UNKNOWN_ACTION') { keyBox.replaceChildren(h('div', { class: 'lai-err', 'data-testid': 'lp-ai-old' }, 'Máy chủ của anh/chị chưa có chức năng AI tìm dự án – cập nhật máy chủ (Cài đặt › Phiên bản) rồi thử lại. Trong lúc chờ, thêm dự án bằng tay.'), _og()); _oo.disabled = true; return; }
}
_o8();
}
function _og() {
return K.button('Thêm tay', async () => {
_of.close();
const AN = await import('../catalog/add_new.js');
AN.openManual(K, ctx, { name: N.cleanName(_oi.value), onSaved: opts.onSaved });
}, { icon: 'plus', testid: 'lp-ai-manual' });
}
function _o8(_oh) {
const e = _or.est;
_oo.disabled = !!(_or.busy || (e && !e.enabled));
if (!e || e.enabled) { keyBox.replaceChildren(); return; }
const _ol = !ctx.user || ctx.user.role === 'owner' || !ctx.user.role;
if (!_ol) { keyBox.replaceChildren(h('div', { class: 'lai-err', 'data-testid': 'lp-ai-key' }, 'App chưa có khoá Gemini nên AI chưa tìm được. Nhờ Quản trị dán khoá Gemini, hoặc thêm dự án bằng tay.'), _og()); return; }
const _oc = h('input', { type: 'password', autocomplete: 'off', placeholder: 'Dán khoá Gemini (bắt đầu bằng AIza…)', 'data-testid': 'lp-ai-key-input', 'aria-label': 'Khoá Gemini' });
const note = h('div', { 'data-testid': 'lp-ai-key-msg', role: 'status' }, _oh ? h('div', { class: _oh.ok ? 'lai-ok' : 'lai-err' }, _oh.text) : null);
const save = K.button('Lưu khoá', async () => {
const _ov = String(_oc.value || '').trim();
if (_ov.length < 20) { note.replaceChildren(h('div', { class: 'lai-err' }, 'Khoá chưa đúng – chép lại cả dãy ở trang Google AI Studio.')); _oc.focus(); return; }
save.disabled = true;
try {
await K.api('settings.set', { key: 'gemini_key', value: _ov });
let t = { ok: true };
try { t = await K.api('connections.test', { target: 'gemini' }); } catch (er) { t = { ok: false, message: (er && er.message) || '' }; }
try { if (ctx.ai && typeof ctx.ai.refreshAvailability === 'function') await ctx.ai.refreshAvailability(); } catch { }
if (t && t.ok === false) { _o8({ ok: false, text: 'Đã lưu khoá nhưng Google báo chưa dùng được: ' + (t.message || 'khoá sai') + '. Kiểm lại khoá rồi lưu lại.' }); return; }
K.toast('Đã lưu khoá Gemini', 'ok');
await estimate();
if (_or.est && _or.est.enabled) _ok.replaceChildren(h('div', { class: 'lai-ok', 'data-testid': 'lp-ai-key-ok' }, '✓ Khoá Gemini đã dùng được – bấm "Tìm thông tin".'));
} catch (er) { _o8({ ok: false, text: 'Chưa lưu được khoá: ' + ((er && er.message) || 'lỗi') }); }
finally { save.disabled = false; }
}, { kind: 'primary', icon: 'key', testid: 'lp-ai-key-save' });
keyBox.replaceChildren(h('div', { class: 'lai-key', 'data-testid': 'lp-ai-key' },
h('b', null, 'Cần khoá Gemini để AI tìm (miễn phí trong hạn mức của Google)'),
h('label', { class: 'lai-f' }, h('span', null, 'Khoá Gemini'), _oc),
h('div', { class: 'lai-row' }, save, K.linkBtn ? K.linkBtn('Lấy khoá Gemini', KEY_URL, null, { icon: 'external', target: '_blank', testid: 'lp-ai-key-get' }) : h('a', { href: KEY_URL, target: '_blank', rel: 'noopener', 'data-testid': 'lp-ai-key-get' }, 'Lấy khoá Gemini')),
note,
h('details', null, h('summary', null, 'Cách lấy khoá (2 phút)'), h('ol', null,
h('li', null, 'Bấm "Lấy khoá Gemini" – trang Google AI Studio mở ở tab mới, đăng nhập Gmail.'),
h('li', null, 'Bấm "Create API key" → chép (Copy) dãy khoá.'),
h('li', null, 'Quay lại tab BDS Studio này, dán khoá vào ô "Khoá Gemini" ở trên, bấm "Lưu khoá" rồi bấm "Tìm thông tin".'))),
h('p', { class: 'lb-muted' }, 'Khoá lưu trên máy chủ Google của anh/chị, không nằm trong trình duyệt. Hoặc thêm dự án bằng tay:'),
_og()));
}
async function _on(pick) {
if (_or.busy) return;
const name = N.cleanName(_oi.value);
if (name.length < N.MIN_Q) { K.toast('Nhập tên dự án (ít nhất 3 ký tự).', 'warn'); _oi.focus(); return; }
if (!_or.est) await estimate();
if (_or.est && !_or.est.enabled) { _o8(); return; }
const ok = await K.aiConfirm(N.FEATURE, { est: _or.est, testid: 'lp-ai-cost', lead: `AI tìm thông tin dự án "${pick ? pick.name : name}" trên Google.` });
if (!ok) return;
_or.busy = true; _oo.disabled = true;
_ok.replaceChildren(h('div', { class: 'lb-muted', 'data-testid': 'lp-ai-busy' }, '🔎 Gemini đang tìm "' + name + '" trên Google…'));
try {
const r = await lookupProject(K, name, { hints: hints(), pick: pick || null });
if (N.askChanged(name, _oi.value)) { _ok.replaceChildren(h('div', { class: 'lai-err' }, 'Tên đã đổi trong lúc AI tìm – bấm "Tìm thông tin" lần nữa.')); return; }
_or.query = r.query || { name, hints: hints(), pick: pick || null };
if ((r.candidates || []).length) return _o7(r.candidates);
if (r.notFound || !r.fields) { _ok.replaceChildren(h('div', { class: 'lai-err', 'data-testid': 'lp-ai-notfound' }, `AI không tìm thấy dự án "${name}" có nguồn đáng tin. Kiểm lại tên, thêm khu vực rồi tìm lại, hoặc thêm tay.`), _og()); return; }
_or.ai = { name, dev: '', loc: '', status: '', handover: '', price: null, typesText: '', ...r.fields, sources: r.sources || [], unsure: r.unsure || [], rows: r.rows || [],
structure: r.structure || null, structureStats: r.structureStats || null };
_o9();
} catch (e) {
const _oh = (e && e.message) || 'lỗi';
if (e && e.code === 'AI_ERROR' && /khoá Gemini/i.test(_oh)) { _or.est = { ...(_or.est || {}), enabled: false }; _ok.replaceChildren(); _o8(); return; }
_ok.replaceChildren(h('div', { class: 'lai-err', 'data-testid': 'lp-ai-error' }, 'Chưa tìm được: ' + _oh), _og());
} finally { _or.busy = false; _oo.disabled = !!(_or.est && !_or.est.enabled); }
}
function _o7(list) {
_ok.replaceChildren(h('b', null, `Có ${list.length} dự án khớp tên – chọn đúng dự án`),
...list.map((c, i) => h('div', { class: 'lai-cand', 'data-testid': 'lp-ai-cand-' + i },
h('div', null, h('b', null, c.name), h('div', { class: 'lb-muted' }, [c.dev, c.loc].filter(Boolean).join(' · ') || '—')),
K.button('Chọn', () => { _oi.value = c.name; _on({ name: c.name, dev: c.dev, loc: c.loc }); }, { kind: 'primary', icon: 'check', testid: 'lp-ai-pick-' + i }))),
_og());
}
function _o9() {
const A = _or.ai;
const _ot = (_od) => (A.unsure.includes(_od) ? h('em', null, ' ⚠ chưa chắc – kiểm lại') : null);
const _oc = (_od, attrs = {}) => h('input', { type: 'text', 'data-testid': 'lp-ai-f-' + _od, ...attrs });
const _ob = {
name: _oc('name', { value: A.name, maxlength: 120 }), dev: _oc('dev', { value: A.dev, maxlength: 120 }), loc: _oc('loc', { value: A.loc, maxlength: 300 }),
lo: _oc('lo', { value: A.price ? String(A.price[0]).replace('.', ',') : '', inputmode: 'decimal', placeholder: 'Từ, VD 45', 'aria-label': 'Giá thấp (triệu/m²)' }),
hi: _oc('hi', { value: A.price ? String(A.price[1]).replace('.', ',') : '', inputmode: 'decimal', placeholder: 'Đến, VD 60', 'aria-label': 'Giá cao (triệu/m²)' }),
types: h('textarea', { 'data-testid': 'lp-ai-f-types', rows: 4, placeholder: '1PN: 45-50\n2PN: 65-75' }),
handover: h('input', { type: 'month', value: A.handover, 'data-testid': 'lp-ai-f-handover' }),
status: K.select(_o2, A.status, { 'data-testid': 'lp-ai-f-status' })
};
_ob.types.value = A.typesText;
const err = h('div', { role: 'alert', 'data-testid': 'lp-ai-err' });
const _oe = (_od, el, key = _od) => h('label', { class: 'lai-f' }, h('span', null, LABEL[_od], _ot(key)), el);
const _ou = K.button('✓ Dùng thông tin này', async () => {
const _ov = { name: _ob.name.value, dev: _ob.dev.value, loc: _ob.loc.value, lo: _ob.lo.value, hi: _ob.hi.value, typesText: _ob.types.value, handover: _ob.handover.value, status: _ob.status.value };
const _o4 = checkForm(_ov);
err.replaceChildren(_o4 ? h('div', { class: 'lai-err' }, _o4) : '');
if (_o4) return;
_ou.disabled = true;
try {
const env = await S.loadEnv(ctx);
const _oa = env.projects.find((p) => S.fold(N.displayName(p)) === S.fold(N.cleanName(_ov.name)));
if (_oa) { err.replaceChildren(h('div', { class: 'lai-err' }, `Đã có dự án "${N.displayName(_oa)}" – chọn dự án đó trong danh sách.`)); return; }
const _om = projectRow(_ov, A, { now: Date.now(), by: (ctx.user && (ctx.user.id || ctx.user.username)) || '', query: _or.query, ids: [...env.projects.map((p) => p.id), ...env.projectRows.map((_ow) => _ow.id)] });
await K.put('projects', _om);
try { await K.put('audit', { at: Date.now(), action: 'landing.ai_project', object_id: _om.id, detail: JSON.stringify({ name: _om.name, sources: A.sources.length }) }); } catch { }
K.toast('Đã thêm dự án ' + _om.name + ' (' + N.AI_REVIEW_NOTE + ')', 'ok');
_of.close();
if (opts.onSaved) await opts.onSaved(_om.id);
} catch (e) { err.replaceChildren(h('div', { class: 'lai-err' }, 'Chưa lưu được: ' + ((e && e.message) || 'lỗi'))); }
finally { _ou.disabled = false; }
}, { kind: 'primary', icon: 'check', testid: 'lp-ai-use' });
_ok.replaceChildren(h('div', { class: 'lai', 'data-testid': 'lp-ai-result' },
h('div', { class: 'lai-warn', 'data-testid': 'lp-ai-warn' }, '⚠️ ' + AI_NOTE + ' trước khi đăng trang. Sửa ô nào sai rồi bấm "Dùng thông tin này".'),
_oe('name', _ob.name, 'name'), _oe('dev', _ob.dev), _oe('loc', _ob.loc),
h('div', { class: 'lai-f' }, h('span', null, LABEL.price, _ot('price')), h('div', { class: 'lai-two' }, _ob.lo, _ob.hi)),
_oe('types', _ob.types), _oe('handover', _ob.handover), _oe('status', _ob.status),
A.structureStats ? h('div', { class: 'lai-ok', 'data-testid': 'lp-ai-struct' }, `🏗️ Có nguồn: ${A.structureStats.zones} phân khu · ${A.structureStats.towers} toà – lưu kèm dự án (xem ở Thông tin dự án › Phân khu · Toà · Trục)`) : null,
h('div', { class: 'lai-src', 'data-testid': 'lp-ai-sources' }, h('b', null, 'Nguồn (' + A.sources.length + ')'),
A.sources.length ? A.sources.slice(0, 8).map((_op) => h('a', { href: _op.url, target: '_blank', rel: 'noopener noreferrer' }, '🔗 ' + _op.title))
: h('span', { class: 'lai-err' }, 'Không có nguồn – tự kiểm chứng trước khi dùng.')),
err, h('div', { class: 'lai-row' }, _ou)));
try { _ob.name.focus({ preventScroll: true }); } catch { }
try { _ok.scrollIntoView({ block: 'start', behavior: 'smooth' }); } catch { }
}
try { _oi.focus(); } catch { }
estimate();
return { close: () => _of.close() };
}

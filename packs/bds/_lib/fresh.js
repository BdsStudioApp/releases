import { h } from './kit.js';
import { FRESH_MIN_SOURCES, freshHost, freshReputable, countFresh } from './fresh_domains.js';
export { freshHost, freshReputable, countFresh };
export const ACTION = 'ai.fresh';
export const MIN_SOURCES = FRESH_MIN_SOURCES;
export const MAX_ROUNDS = 3;
export const MERGE_CAP = { news: 12, bank_rates: 60, tax: 6 };
export const TAX_KEYS = ['pit', 'lptb', 'lptb_online', 'maintenance', 'notary', 'appraisal'];
export const TOPIC_LABEL = { news: 'tin thị trường BĐS', bank_rates: 'lãi suất cho vay mua nhà', tax: 'thuế, phí chuyển nhượng BĐS' };
const _o0 = {
news: 'báo chính thống và trang Chính phủ (vnexpress.net, tuoitre.vn, thanhnien.vn, vietnamnet.vn, dantri.com.vn, cafef.vn, vneconomy.vn, baochinhphu.vn, nhandan.vn, laodong.vn, tienphong.vn, baodautu.vn, vietnamplus.vn, trang .gov.vn…)',
bank_rates: 'trang CHÍNH THỨC của từng ngân hàng (vietcombank.com.vn, bidv.com.vn, vietinbank.vn, agribank.com.vn, techcombank.com, vpbank.com.vn, mbbank.com.vn, acb.com.vn, sacombank.com.vn, hdbank.com.vn, tpb.vn, vib.com.vn, shb.com.vn, msb.com.vn, ocb.com.vn…), sbv.gov.vn và báo kinh tế lớn (cafef.vn, vneconomy.vn, vnexpress.net)',
tax: 'văn bản pháp luật và trang Nhà nước (thuvienphapluat.vn, luatvietnam.vn, vbpl.vn, chinhphu.vn, mof.gov.vn, gdt.gov.vn, quochoi.vn, trang .gov.vn của tỉnh/thành) và báo chính thống'
};
function _o17(now) {
const _o8 = new Date((now || Date.now()) + 7 * 3600e3);
return String(_o8.getUTCDate()).padStart(2, '0') + '/' + String(_o8.getUTCMonth() + 1).padStart(2, '0') + '/' + _o8.getUTCFullYear();
}
export function freshPrompt(topic, { ask, shape, now } = {}) {
return [
'BDS_AI_FRESH topic=' + topic,
'Hôm nay là ' + _o17(now) + ' (giờ Việt Nam). Bạn là trợ lý nghiên cứu cho môi giới bất động sản tại Việt Nam.',
'Việc cần làm: ' + String(ask || '').trim(),
'BẮT BUỘC:',
'1. Dùng Google Search, đọc ÍT NHẤT ' + MIN_SOURCES + ' trang web KHÁC NHAU (khác tên miền) và UY TÍN, ưu tiên: ' + (_o0[topic] || 'nguồn chính thức') + '.',
'2. Chỉ lấy thông tin MỚI NHẤT (gần ngày hôm nay nhất). Ghi rõ ngày đăng/ngày hiệu lực của từng thông tin; bỏ thông tin cũ đã bị thay thế.',
'3. Không bịa số. Không tìm thấy thì ghi null. Mỗi mục phải có link nguồn thật (source_url) và tên trang (source_name).',
'4. Trả lời bằng tiếng Việt, cuối cùng in DUY NHẤT một khối ```json … ``` đúng cấu trúc: ' + String(shape || '{"items":[{"title":"…","summary":"…","source_name":"…","source_url":"https://…","date":"YYYY-MM-DD"}]}'),
].join('\n');
}
export function parseFreshJson(text) {
const t = String(text || '');
const _o1 = [...t.matchAll(/```(?:json)?\s*([\s\S]*?)```/gi)].map((_oq) => _oq[1]);
const _o5 = _o1.length ? _o1.reverse() : [];
const a = t.indexOf('{'), b = t.lastIndexOf('}');
if (a >= 0 && b > a) _o5.push(t.slice(a, b + 1));
for (const _o2 of _o5) { try { const _ol = JSON.parse(_o2.trim()); if (_ol && typeof _ol === 'object') return _ol; } catch { } }
return null;
}
export function safeUrl(u) { const s = String(u || '').trim(); return /^https?:\/\/[^\s"'<>]+$/i.test(s) ? s : ''; }
export function freshMorePrompt(topic, base, { check, round = 2 } = {}) {
const _o2 = check || { domains: [], reputable: 0 };
const _oh = (_o2.domains || []).filter((_o8) => _o8.reputable).map((_o8) => _o8.domain).slice(0, 30);
const _ov = Math.max(1, MIN_SOURCES - (Number(_o2.reputable) || 0));
return [String(base || '').trim(), '',
'BỔ SUNG – LƯỢT TÌM THÊM SỐ ' + round + ':',
'Các lượt trước mới có ' + (Number(_o2.reputable) || 0) + ' trang uy tín' + (_oh.length ? ': ' + _oh.join(', ') : '') + '.',
'Hãy tìm thêm ÍT NHẤT ' + _ov + ' trang uy tín KHÁC (KHÁC TÊN MIỀN với các trang đã liệt kê), ưu tiên: ' + (_o0[topic] || 'nguồn chính thức') + '.',
'Chỉ trả về các mục MỚI (chưa có ở các lượt trước) hoặc mục có thông tin MỚI HƠN; vẫn in DUY NHẤT một khối ```json … ``` CÙNG CẤU TRÚC như yêu cầu ở trên.'].join('\n');
}
export function freshErrorText(e) {
const code = String((e && e.code) || '');
const msg = String((e && e.message) || e || '').trim();
if (code === 'QUOTA') return 'Gemini đang hết lượt hoặc quá tải, hoặc lần này vượt trần ngân sách AI tháng. ' + (msg ? '(' + msg + ') ' : '') + 'Đợi vài phút rồi bấm "Thử lại", hoặc nhờ Chủ nâng trần ở Cài đặt → Ngân sách AI.';
if (code === 'AI_ERROR') return 'Gemini không trả lời được lần này' + (msg ? ': ' + msg : '') + '. Bấm "Thử lại" sau ít phút. Các lượt đã tìm được vẫn được giữ.';
if (code === 'NETWORK' || code === 'TIMEOUT' || code === 'INTERNAL' || /hết giờ|timeout|không kết nối|network/i.test(msg)) {
return 'Hết thời gian chờ: máy chủ chưa trả lời kịp (Google giới hạn thời gian mỗi lần tìm, hoặc mạng chập chờn). Bấm "Thử lại" – các lượt đã tìm được vẫn được giữ.';
}
return 'Chưa cập nhật được' + (msg ? ': ' + msg : '') + '. Bấm "Thử lại" sau ít phút.';
}
const isoDay = (s) => {
const _oq = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(s || '').trim());
if (!_oq) return '';
const _o8 = new Date(Date.UTC(+_oq[1], +_oq[2] - 1, +_oq[3]));
return _o8.getUTCFullYear() === +_oq[1] && _o8.getUTCMonth() === +_oq[2] - 1 && _o8.getUTCDate() === +_oq[3] ? _oq[0] : '';
};
const _of = (s) => String(s == null ? '' : s).normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/gi, 'd').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
export function linkKey(u) {
const s = String(u || '').trim();
const _oq = /^https?:\/\/([^/?#]+)([^?#]*)(\?[^#]*)?/i.exec(s);
if (!_oq) return '';
const q = (_oq[3] || '').slice(1).split('&').filter((x) => x && !/^(utm_|fbclid|gclid)/i.test(x)).join('&');
return _oq[1].toLowerCase().replace(/^www\./, '') + (_oq[2] || '').replace(/\/+$/, '').toLowerCase() + (q ? '?' + q : '');
}
const _op = (_oy, ...keys) => {
if (Array.isArray(_oy)) return _oy;
if (_oy && typeof _oy === 'object') for (const _om of keys) if (Array.isArray(_oy[_om])) return _oy[_om];
return [];
};
const _oa = (x) => isoDay(x && (x.date || x.published || x.updated)) || '';
function _oz(a, b) {
const _o9 = _oa(a), db = _oa(b);
const [win, lose] = db > _o9 ? [b, a] : [a, b];
const out = { ...win };
for (const _om of Object.keys(lose)) if (out[_om] == null || out[_om] === '') out[_om] = lose[_om];
return out;
}
function _or(la, lb, keysOf, cap, newestFirst) {
const _ok = new Map(), out = [];
for (const x of [...la, ...lb]) {
if (!x || typeof x !== 'object') continue;
const _oo = keysOf(x).filter(Boolean);
if (!_oo.length) continue;
const _oj = _oo.map((_om) => _ok.get(_om)).find((i) => i != null);
if (_oj != null) { out[_oj] = _oz(out[_oj], x); _oo.forEach((_om) => _ok.set(_om, _oj)); continue; }
_oo.forEach((_om) => _ok.set(_om, out.length));
out.push(x);
}
if (!newestFirst) return out.slice(0, cap);
return out.map((x, i) => [x, i]).sort((_oy, q) => (_oa(q[0]).localeCompare(_oa(_oy[0]))) || _oy[1] - q[1]).map((_oy) => _oy[0]).slice(0, cap);
}
const _o18 = (x) => !!x && typeof x === 'object' && !!safeUrl(x.source_url) && Object.keys(x).some((_om) => !/^(source_|date|legal|effective)/.test(_om) && x[_om] != null);
export function mergeFreshResults(a, b, { topic, keyOf } = {}) {
if (!a && !b) return null;
if (topic === 'tax') {
const A = a && typeof a === 'object' ? a : {}, B = b && typeof b === 'object' ? b : {};
const out = {};
for (const _om of TAX_KEYS.slice(0, MERGE_CAP.tax)) {
const x = A[_om] && typeof A[_om] === 'object' ? A[_om] : null, y = B[_om] && typeof B[_om] === 'object' ? B[_om] : null;
if (!x && !y) continue;
if (!x || !y) { out[_om] = { ...(x || y) }; continue; }
const _o19 = _o18(x), uy = _o18(y);
out[_om] = _o19 && !uy ? { ...x } : uy && !_o19 ? { ...y } : _oz(x, y);
}
return Object.keys(out).length ? out : null;
}
if (topic === 'bank_rates') {
const _on = typeof keyOf === 'function' ? keyOf : _of;
const banks = _or(_op(a, 'banks', 'items'), _op(b, 'banks', 'items'), (x) => [_on(x.bank || x.name || x.title)], MERGE_CAP.bank_rates, false);
return banks.length ? { banks } : null;
}
const items = _or(_op(a, 'items'), _op(b, 'items'), (x) => [linkKey(x.source_url || x.url || x.link), _of(x.title)], MERGE_CAP[topic] || MERGE_CAP.news, true);
return items.length ? { items } : null;
}
export function combineFreshRounds(rounds, { topic, keyOf } = {}) {
const list = (rounds || []).filter(Boolean);
const sources = [], segments = [], queries = [];
let parsed = null, cost = 0, last = {};
for (const _o10 of list) {
const _ox = sources.length;
for (const s of _o10.sources || []) sources.push(s);
for (const g of _o10.segments || []) segments.push({ ...g, chunks: (g.chunks || []).map((i) => i + _ox) });
for (const q of _o10.queries || []) if (!queries.includes(q)) queries.push(q);
parsed = mergeFreshResults(parsed, parseFreshJson(_o10.text), { topic, keyOf });
cost += Number(_o10.cost_usd) || 0;
last = _o10;
}
return { text: list.map((_o10) => _o10.text || '').join('\n\n'), parsed, sources, segments, queries, cost_usd: cost, model: last.model, at: Math.max(0, ...list.map((_o10) => Number(_o10.at) || 0)) || last.at,
estimate: last.estimate, check: countFresh(topic, sources), rounds: list.length };
}
export function freshStamp(_os) {
if (!_os || !_os.at) return '';
return 'Cập nhật qua AI ngày ' + _o17(_os.at) + (_os.reputable ? ' từ ' + _os.reputable + ' trang uy tín' : '') + ' · chỉ mang tính tham khảo';
}
export function costText(e) {
if (!e) return 'Đang tính chi phí ước tính…';
if (!e.enabled) return 'Chưa có khoá Gemini trên máy chủ – Chủ app dán khoá ở Cài đặt → Kết nối rồi mới cập nhật được.';
if (e.free) return `Chi phí ước tính: 0 USD – khoá Gemini đang ở hạn mức miễn phí (mẫu ${e.model}, có tìm Google). Hết hạn mức miễn phí thì Google tính phí theo bảng giá của Google.`;
const _ou = (x, _o8) => Number(x || 0).toLocaleString('vi-VN', { maximumFractionDigits: _o8 });
return `Mất phí AI: ≈ ${_ou(e.usd, 3)} USD tiền Gemini (mẫu ${e.model}) cho lần này. Tìm Google: miễn phí ${_ou(e.search_free_per_month, 0)} lượt tìm/tháng, ` +
`vượt thì ${_ou(e.search_usd_per_query, 3)} USD/lượt (lần này khoảng ${e.queries} lượt → tối đa ≈ ${_ou(e.usd_if_search_paid, 3)} USD). ` +
`Cộng vào ngân sách AI tháng${e.budget_cap_usd ? ` – đã dùng ${_ou(e.budget_spent_usd, 2)}/${_ou(e.budget_cap_usd, 0)} USD` : ''}.`;
}
export function canFresh(ctx) {
const _oy = ctx && ctx.user && ctx.user.perms;
return !(_oy && _oy.ai === false);
}
export function freshButton(K, ctx, opts) {
if (!canFresh(ctx)) return null;
const _ow = h('span', { class: 'sl-small sl-muted', 'data-testid': (opts.testid || 'fresh') + '-fee' }, '💰 Mất phí AI (Gemini + tìm Google) – app báo chi phí trước khi chạy');
const btn = K.button('🔄 Cập nhật thông tin mới nhất qua AI', () => openFresh(K, ctx, opts), { kind: 'secondary', testid: (opts.testid || 'fresh') + '-btn' });
return h('div', { class: 'sl-col', style: 'gap:4px', 'data-testid': opts.testid || 'fresh', 'data-ai': 'auto' }, btn, _ow);
}
export function openFresh(K, ctx, opts) {
const _o16 = opts.testid || 'fresh';
const _o15 = { est: null, err: '', rounds: [], res: null, busy: false, asking: false };
const estBox = h('p', { class: 'sl-small', 'aria-live': 'polite', 'data-testid': _o16 + '-cost' });
const acts = h('div', { class: 'sl-row' });
const out = h('div', { class: 'sl-col', 'aria-live': 'polite', 'data-testid': _o16 + '-result' });
const _oq = K.modal({ title: '🔄 ' + (opts.title || 'Cập nhật thông tin mới nhất qua AI'), wide: true, testid: _o16 + '-modal', body: h('div', { class: 'sl-col' },
h('p', null, 'Gemini tìm trên Google ' + (TOPIC_LABEL[opts.topic] || 'thông tin') + ' MỚI NHẤT, đọc ít nhất ' + MIN_SOURCES + ' trang uy tín khác nhau. ' +
'Chưa đủ ' + MIN_SOURCES + ' trang uy tín thì app hỏi anh/chị có tìm thêm một lượt nữa không (báo phí trước, tối đa ' + MAX_ROUNDS + ' lượt); vẫn chưa đủ thì app chỉ cho xem, không lưu. Kết quả chỉ mang tính tham khảo.'),
estBox, acts, out) });
const _od = () => { estBox.textContent = _o15.err || costText(_o15.est); estBox.className = 'sl-small ' + (_o15.err ? 'g1-err' : _o15.est && !_o15.est.enabled ? 'g1-warn' : 'sl-muted'); };
const _oc = () => {
const _og = K.button(_o15.busy ? 'Đang tìm… (có thể tới 1–2 phút)' : _o15.rounds.length ? 'Chạy lại từ đầu' : 'Đồng ý chi phí – bắt đầu', startOver, { kind: 'primary', icon: _o15.busy ? 'clock' : _o15.rounds.length ? 'refresh' : 'check', testid: _o16 + '-run' });
try { _og.disabled = !!(_o15.busy || !_o15.est || !_o15.est.enabled); } catch { }
acts.replaceChildren(_og, K.button('Đóng', () => _oq.close(), { testid: _o16 + '-close' }));
};
const _o7 = () => combineFreshRounds(_o15.rounds, { topic: opts.topic, keyOf: opts.mergeKey });
async function _oe(prompt) {
const _o10 = await K.api(ACTION, { topic: opts.topic, prompt, estimate_only: true });
return (_o10 && _o10.estimate) || null;
}
async function estimate() {
try { _o15.est = await _oe(opts.prompt()); }
catch (e) { _o15.err = 'Chưa tính được chi phí: ' + (e && e.message || e); }
_od(); _oc();
}
function startOver() {
if (_o15.busy || !_o15.est || !_o15.est.enabled) return;
_o15.rounds = []; _o15.res = null;
_ob(1);
}
async function _ob(_ou, prompt) {
if (_o15.busy) return;
const _oy = prompt || (_ou === 1 ? opts.prompt() : freshMorePrompt(opts.topic, opts.prompt(), { check: _o7().check, round: _ou }));
_o15.busy = true; _o15.err = ''; _oc(); _od();
const _o1a = h('p', { class: 'sl-muted', 'data-testid': _o16 + '-wait' }, _ou === 1 ? 'Gemini đang tìm và đọc các trang…' : 'Lượt ' + _ou + '/' + MAX_ROUNDS + ': Gemini đang tìm thêm các trang uy tín khác…');
if (_o15.rounds.length) out.append(_o1a); else out.replaceChildren(_o1a);
try {
const _o10 = await K.api(ACTION, { topic: opts.topic, prompt: _oy });
_o15.rounds.push(_o10); _o15.res = _o7(); _o15.busy = false; _o14();
} catch (e) {
_o15.busy = false;
_o14();
out.prepend(h('div', { class: 'g1-err sl-col', 'data-testid': _o16 + '-error', 'data-code': String((e && e.code) || '') },
h('p', null, 'Lượt ' + _ou + '/' + MAX_ROUNDS + ' chưa xong. ' + freshErrorText(e)),
h('div', { class: 'sl-row' }, K.button('Thử lại', () => _ob(_ou, _oy), { kind: 'primary', testid: _o16 + '-retry' }))));
} finally { _o15.busy = false; _oc(); }
}
async function more() {
if (_o15.busy || _o15.asking || !_o15.rounds.length) return;
_o15.asking = true;
const _ou = _o15.rounds.length + 1, _o2 = _o7();
const _oy = freshMorePrompt(opts.topic, opts.prompt(), { check: _o2.check, round: _ou });
let est = null;
try { est = await _oe(_oy); } catch { est = null; }
est = est || _o2.estimate || _o15.est;
const _ov = Math.max(1, MIN_SOURCES - _o2.check.reputable);
const ok = await K.confirm({ title: 'Tìm thêm trang uy tín – lượt ' + _ou + '/' + MAX_ROUNDS,
text: 'Mới có ' + _o2.check.reputable + ' trang uy tín (cần ≥ ' + MIN_SOURCES + '), còn thiếu ' + _ov + '. Gemini sẽ tìm thêm lượt ' + _ou + ' (mất thêm 1–2 phút). ' +
(_ou >= MAX_ROUNDS ? 'Đây là lượt CUỐI. ' : '') + 'Lượt này mất phí riêng. ' + costText(est),
ok: 'Đồng ý chi phí – tìm thêm', testid: _o16 + '-more-confirm' });
_o15.asking = false;
if (ok) _ob(_ou, _oy);
}
function _o14() {
const _o10 = _o15.res;
if (!_o10) { out.replaceChildren(); return; }
const _o6 = _o10.check || { reputable: 0, distinct: 0, domains: [], enough: false, min: MIN_SOURCES };
const parsed = _o10.parsed;
const _o13 = new Set();
const _ot = (_o10.sources || []).filter((s) => { const _o8 = s.domain || freshHost(s); if (_o8 && _o13.has(_o8)) return false; if (_o8) _o13.add(_o8); return true; });
const _os = { at: _o10.at || Date.now(), model: _o10.model, reputable: _o6.reputable, distinct: _o6.distinct, rounds: _o10.rounds,
sources: _ot.map((s) => ({ domain: s.domain || freshHost(s), url: safeUrl(s.url), title: s.title || '', reputable: freshReputable(opts.topic, s.domain || freshHost(s)) })) };
_os.stamp = freshStamp(_os);
const doms = h('div', { class: 'sl-chips', 'data-testid': _o16 + '-domains' }, (_o6.domains || []).map((_o8) =>
h('span', { class: 'sl-chip' + (_o8.reputable ? ' on' : ''), title: _o8.reputable ? 'Nguồn uy tín' : 'Không nằm trong danh sách uy tín' }, (_o8.reputable ? '✓ ' : '') + _o8.domain)));
const _o3 = !_o6.enough && _o10.rounds < MAX_ROUNDS;
const _oi = h('p', { class: _o6.enough ? 'g1-okbox' : 'g1-warn', 'data-testid': _o16 + '-check', 'data-enough': String(!!_o6.enough), 'data-rounds': String(_o10.rounds) },
_o6.enough ? `Đủ tin cậy: ${_o6.reputable} trang uy tín khác nhau (cần ≥ ${_o6.min || MIN_SOURCES})` + (_o10.rounds > 1 ? ` sau ${_o10.rounds} lượt tìm.` : '.')
: `Chưa đủ tin cậy: mới tìm được ${_o6.reputable} trang uy tín (cần ≥ ${_o6.min || MIN_SOURCES})` + (_o10.rounds > 1 ? ` sau ${_o10.rounds} lượt tìm` : '') + '. Kết quả chỉ để xem, chưa lưu được – ' +
(_o3 ? 'bấm "Tìm thêm trang uy tín" (app báo phí trước khi chạy) hoặc "Chạy lại từ đầu" sau ít phút.' : 'đã tìm tối đa ' + MAX_ROUNDS + ' lượt; bấm "Chạy lại từ đầu" sau ít phút.'));
const cost = h('p', { class: 'sl-small sl-muted', 'data-testid': _o16 + '-spent' }, `Đã tốn ≈ ${Number(_o10.cost_usd || 0).toLocaleString('vi-VN', { maximumFractionDigits: 4 })} USD · ${(_o10.queries || []).length} lượt tìm Google · ${_o10.rounds} lượt gọi AI · mẫu ${_o10.model}`);
let view = null;
try { view = parsed ? opts.render(parsed, _o10) : null; } catch { view = null; }
if (!view) view = h('pre', { class: 'sl-small', style: 'white-space:pre-wrap' }, String(_o10.text || '').slice(0, 6000));
const _o4 = _o6.enough && parsed && typeof opts.onSave === 'function';
const _o12 = _o4 ? K.button('Lưu kết quả này', async () => {
try { const _o11 = await opts.onSave(parsed, _os); K.toast((typeof _o11 === 'string' && _o11 ? _o11 + ' – ' : 'Đã lưu – ') + _os.stamp, 'success'); _oq.close(); }
catch (e) { K.toast('Chưa lưu được: ' + (e && e.message || e), 'warn'); }
}, { kind: 'primary', testid: _o16 + '-save' }) : null;
const moreBtn = _o3 ? K.button('🔎 Tìm thêm trang uy tín (lượt ' + (_o10.rounds + 1) + '/' + MAX_ROUNDS + ')', more, { kind: 'secondary', testid: _o16 + '-more' }) : null;
out.replaceChildren(_oi, doms, view, h('p', { class: 'sl-small sl-muted' }, _os.stamp), cost, (_o12 || moreBtn) ? h('div', { class: 'sl-row sl-end' }, moreBtn, _o12) : null);
}
_od(); _oc(); estimate();
return { close: () => _oq.close() };
}

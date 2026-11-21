import { h, modal, icon } from './ui.efd703fd85.js';
export const SKIP_MAX_USD = 0.01;
export const MEMO_KEY = 'bds:ai_ok';
export const ROUGH_PRICES = { gemini: { in: 0.30, out: 2.50 }, claude_api: { in: 2.0, out: 10.0 } };
export const PROVIDER_NAMES = {
gemini: 'Google Gemini', gemini_search: 'Google Gemini (có tìm Google)', claude_api: 'Claude API (Anthropic)',
handoff_claude: 'Claude qua chat', handoff_gemini: 'Gemini qua chat', handoff: 'Claude/Gemini qua chat',
veo_api: 'Google Veo API', kling: 'Kling', runway: 'Runway', flow: 'Google Flow', video_api: 'dịch vụ video AI trên mạng',
vbee: 'Vbee (giọng đọc)', engine: 'máy dựng trên máy tính', local: 'AI trên máy',
};
const _o1 = new Set(['engine', 'local']);
const _o0 = new Set(['handoff', 'handoff_claude', 'handoff_gemini', 'flow']);
const _o3 = new Set(['veo_api', 'kling', 'runway', 'video_api']);
export const FEATURES = {
ask_ai: { label: 'Hỏi app – nhờ AI trả lời', kind: 'text', data: 'câu hỏi app không tự trả lời được (kèm tên các màn hình của app)' },
zalo_draft: { label: 'Viết tin Zalo bằng AI', kind: 'text', data: 'tên, nhu cầu của khách và nháp tin' },
policy_read: { label: 'Đọc phiếu tính giá bằng AI', kind: 'doc', data: 'ảnh/PDF phiếu tính giá' },
layout_read: { label: 'Đọc ảnh layout căn', kind: 'doc', data: 'ảnh mặt bằng căn và tên dự án' },
catalog_research: { label: 'AI tìm thông tin dự án', kind: 'search', provider: 'gemini_search', data: 'tên dự án và thông tin dự án đang có' },
catalog_extract: { label: 'AI đọc file dự án', kind: 'doc', data: 'nội dung file (bảng giá, chính sách, mặt bằng…)' },
ideas_classify: { label: 'Phân loại ý tưởng bằng AI', kind: 'text', data: 'link, chủ đề hoặc ảnh anh/chị dán vào' },
ideas_suggest: { label: 'Gợi ý ý tưởng bằng AI', kind: 'text', data: 'tên các ý tưởng đã có' },
ideas_scenes: { label: 'AI dàn cảnh cho ý tưởng', kind: 'text', data: 'tiêu đề và tóm tắt ý tưởng' },
market_report: { label: 'Viết bản tin thị trường', kind: 'text', data: 'số liệu tổng hợp 7 ngày và tin đã lấy' },
intent_ai: { label: 'AI chấm bình luận', kind: 'text', data: 'nội dung bình luận (có thể có tên, số điện thoại người bình luận)' },
ads_ai: { label: 'AI viết mẫu quảng cáo', kind: 'text', data: 'tên dự án, điểm mạnh, ưu đãi' },
g2_reply: { label: 'AI soạn trả lời khách', kind: 'text', data: 'tin nhắn/bình luận của khách' },
g2_script: { label: 'AI soạn kịch bản xử lý từ chối', kind: 'text', data: 'câu từ chối của khách' },
g2_read: { label: 'AI gợi ý khi đọc khách', kind: 'text', data: 'hồ sơ nhu cầu của khách (đã ẩn tên, số điện thoại, email)' },
g5_assist: { label: 'Trợ lý AI (gói Trải nghiệm & Học tập)', kind: 'text', data: 'nội dung anh/chị nhập ở màn này' },
g5_practice: { label: 'Luyện tư vấn với khách ảo', kind: 'text', data: 'đoạn hội thoại luyện tập' },
g5_drill: { label: 'Luyện tình huống mỗi ngày (AI soạn)', kind: 'text', data: 'chủ đề luyện tập và các câu khách đã luyện gần đây (không có dữ liệu khách thật)' },
g5_proj_quiz: { label: 'AI soạn câu ôn theo dự án (Học mỗi ngày)', kind: 'text', data: 'thông tin dự án công ty trong app (tên, giá, loại căn, bàn giao…; không có dữ liệu khách)' },
g5_dandan: { label: 'AI gợi ý lời dẫn', kind: 'text', data: 'mô tả căn và lời dẫn đang soạn' },
g5_map_read: { label: 'AI đọc bản đồ quy hoạch / layout căn', kind: 'doc', data: 'ảnh hoặc trang PDF bản đồ, layout anh/chị tải lên' },
g4_site: { label: 'Tự tìm tin công trường', kind: 'search', provider: 'gemini_search', data: 'tên dự án, khu vực' },
staff_run: { label: 'Nhân viên AI', kind: 'text', data: 'việc giao cho nhân viên AI (đề bài, ý tưởng)' },
staff_research: { label: 'Gom tin & gợi ý chủ đề', kind: 'text', data: 'tin đã gom và chủ đề đang theo dõi' },
source_ai: { label: 'AI nhận xét nguồn khách', kind: 'text', data: 'số gộp theo nguồn khách (không có tên, số điện thoại khách)' },
video_script: { label: 'AI soạn kịch bản video', kind: 'search', data: 'chủ đề hoặc link bài báo anh/chị dán' },
video_caption: { label: 'AI soạn caption', kind: 'text', data: 'dàn cảnh đã duyệt' },
video_describe: { label: 'Tự mô tả từ ảnh bằng AI', kind: 'image', data: 'ảnh chân dung và ảnh căn hộ anh/chị chọn' },
studio_rewrite: { label: 'AI viết lại phụ đề', kind: 'text', data: 'phụ đề và tiêu đề cảnh' },
studio_paid: { label: 'Dịch vụ video AI trả phí cho cảnh', kind: 'video', provider: 'video_api', alwaysAsk: true, data: 'lời nhắn cảnh (và ảnh tham chiếu nếu có)' },
videoai_clip: { label: 'Tạo cảnh Video AI trên mạng', kind: 'video', provider: 'video_api', alwaysAsk: true, data: 'lời nhắn cảnh, lời đọc và ảnh tham chiếu (nếu có)' },
vbee_voice: { label: 'Giọng đọc Vbee', kind: 'tts', provider: 'vbee', alwaysAsk: true, data: 'lời đọc của video' },
handoff: { label: 'Làm qua chat Claude/Gemini', kind: 'chat', provider: 'handoff', data: 'lời nhắn soạn sẵn (anh/chị tự dán)' },
local_render: { label: 'Dựng video trên máy', kind: 'local', provider: 'engine', data: '' },
videoai_local: { label: 'AI tạo cảnh trên máy', kind: 'local', provider: 'local', data: '' },
};
export const TASK_FEATURE = { zalo_draft: 'zalo_draft', read_policy: 'policy_read', read_layout: 'layout_read', ideas: 'ideas_suggest', staff: 'staff_run', assistant: 'ask_ai' };
const num = (v) => { if (v === null || v === undefined || v === '') return null; const n = Number(v); return Number.isFinite(n) ? n : null; };
export function fmtUsd(v) {
const n = num(v);
if (n === null) return '';
if (n === 0) return '0 USD';
if (n < 0.001) return '< 0,001 USD';
const _o6 = n < 0.01 ? 4 : n < 1 ? 3 : 2;
return String(Math.round(n * 10 ** _o6) / 10 ** _o6).replace('.', ',') + ' USD';
}
export function featureSpec(feature, { provider, task } = {}) {
const base = typeof feature === 'string' ? (FEATURES[feature] ? { id: feature, ...FEATURES[feature] } : { id: feature, label: feature, kind: 'text' })
: feature && typeof feature === 'object' ? { ...(feature.id && FEATURES[feature.id] ? FEATURES[feature.id] : {}), ...feature }
: { id: TASK_FEATURE[task] || task || 'ai', ...(FEATURES[TASK_FEATURE[task]] || { label: 'Dùng AI', kind: 'text', data: 'nội dung anh/chị nhập' }) };
const _of = { kind: 'text', data: 'nội dung anh/chị nhập', ...base };
if (!_of.id) _of.id = TASK_FEATURE[task] || task || 'ai';
if (provider) _of.provider = provider;
if (!_of.provider) _of.provider = _of.kind === 'local' ? 'local' : 'gemini';
if (_of.kind === 'search' && _of.provider === 'gemini') _of.provider = 'gemini_search';
if (_o1.has(_of.provider)) _of.kind = 'local';
else if (_o0.has(_of.provider)) _of.kind = 'chat';
else if (_o3.has(_of.provider)) { _of.kind = 'video'; _of.alwaysAsk = true; }
if (_of.provider === 'claude_api' || _of.kind === 'tts' || _of.kind === 'video') _of.alwaysAsk = true;
return _of;
}
export const providerName = (_ob) => PROVIDER_NAMES[_ob] || String(_ob || 'AI');
export function payerText(_of, env = {}) {
if (_of.kind === 'local') return 'Chạy trên máy – miễn phí, dữ liệu không ra ngoài.';
if (_of.provider === 'flow') return 'Anh/chị tự tạo trong Google Flow – trừ tín dụng AI hằng tháng của gói Google AI Pro (cần có gói), không tính thêm ngoài phí gói.';
if (_of.kind === 'chat') return 'Anh/chị tự dán vào chat AI – theo gói chat đang có (thường 0 đồng).';
if (_of.kind === 'video') return 'Tính phí theo lượt tạo trên tài khoản của anh/chị ở nhà cung cấp video.';
if (_of.kind === 'tts') return 'Tính phí theo số ký tự trên tài khoản Vbee của anh/chị.';
if (_of.provider === 'claude_api') return 'Có phí theo lượt, dùng khoá Claude của anh/chị, cộng vào ngân sách AI tháng.';
if (env.geminiFree !== false) return 'Dùng khoá Gemini của anh/chị – miễn phí trong hạn mức của Google.';
return 'Dùng khoá Gemini trả phí của anh/chị – mỗi lần một ít, cộng vào ngân sách AI tháng.';
}
export function mayCost(_of, env = {}) {
if (_of.kind === 'local' || _of.kind === 'chat') return false;
if (_of.alwaysAsk) return true;
return env.geminiFree === false;
}
export function badgeInfo(feature, env = {}) {
const _of = featureSpec(feature, env);
const local = _of.kind === 'local', paid = mayCost(_of, env);
const text = local ? '✨ AI · trên máy' : _of.provider === 'flow' ? '✨ AI · tín dụng gói' : _of.kind === 'chat' ? '✨ AI · qua chat' : paid ? '✨ AI · có thể tốn phí' : '✨ AI';
const title = (local ? '' : 'Dùng AI: ' + (_of.providerLabel || providerName(_of.provider)) + '. ') + payerText(_of, env) + (local || _of.kind === 'chat' ? '' : ' App hỏi trước khi gửi.');
return { text, title, paid, local, id: _of.id };
}
export function roughEstimate({ provider = 'gemini', prompt = '', images = 0, json = false, free } = {}) {
const _ob = provider === 'gemini_search' ? 'gemini' : provider;
const _od = ROUGH_PRICES[_ob];
if (!_od) return null;
if (_ob === 'gemini' && free !== false) return { usd: 0, free: true, rough: true, provider: _ob };
const _oi = Math.ceil(String(prompt || '').length / 2) + (Number(images) || 0) * 1300;
const _oj = json ? 2000 : 1000;
return { usd: Math.round(((_oi * _od.in + _oj * _od.out) / 1e6) * 10000) / 10000, free: false, rough: true, provider: _ob, tokens_in: _oi, tokens_out: _oj };
}
export function costInfo(feature, est, env = {}) {
const _of = featureSpec(feature, env);
if (_of.kind === 'local') return { tier: 'local', usd: 0, text: 'Chạy trên máy – miễn phí.' };
if (_of.kind === 'chat') return { tier: 'chat', usd: 0, text: _of.provider === 'flow' ? payerText(_of, env) : 'Miễn phí – anh/chị tự dán vào chat AI theo gói đang có.' };
const e = est || null;
const usd = e ? num(e.usd) : null;
const _oh = e ? num(e.budget_spent_usd ?? (e.budget && e.budget.spent_usd)) : null;
const _o5 = e ? num(e.budget_cap_usd ?? (e.budget && e.budget.cap_usd)) : null;
const budget = _oh !== null && _o5 ? ` Ngân sách AI tháng: đã dùng ${fmtUsd(_oh)} / ${fmtUsd(_o5)}.` : '';
const over = !!(usd && _o5 && _oh !== null && _oh + usd > _o5);
const _o8 = e && e.text ? String(e.text) : '';
if (_o8 && usd === null) return { tier: 'paid', usd: null, text: _o8 + budget, over };
if (e && (e.free === true || (usd === 0 && !_of.alwaysAsk))) {
return { tier: 'free', usd: 0, text: '0 USD – trong hạn mức miễn phí của khoá Gemini' + (e.model ? ' (mẫu ' + e.model + ')' : '') + '.', over: false };
}
if (usd === null) {
const _ok = _of.kind === 'tts' ? 'Tính phí theo số ký tự lời đọc, trên tài khoản Vbee của anh/chị.'
: _of.kind === 'video' ? 'Tính phí theo nhà cung cấp video, trên tài khoản của anh/chị.'
: 'Tính phí theo nhà cung cấp, dùng khoá của anh/chị.';
return { tier: _of.alwaysAsk ? 'paid' : 'unknown', usd: null, text: _ok + budget, over: false };
}
const tier = _of.alwaysAsk || usd > SKIP_MAX_USD ? 'paid' : 'low';
const text = _o8 ? _o8 + budget + (over ? ' Lần này sẽ VƯỢT trần ngân sách.' : '') : '≈ ' + fmtUsd(usd) + ' / lần' + (e.rough ? ' (ước tính thô)' : '') + (e.model ? ' · mẫu ' + e.model : '') + ', cộng vào ngân sách AI tháng.' + budget
+ (over ? ' Lần này sẽ VƯỢT trần ngân sách – máy chủ sẽ từ chối; làm qua chat hoặc Chủ nâng trần.' : '');
return { tier, usd, text, over };
}
export function canSkip(feature, cost, env = {}) {
const _of = featureSpec(feature, env);
if (_of.alwaysAsk || _of.kind === 'video' || _of.kind === 'tts') return false;
if (!cost) return false;
if (cost.tier === 'free') return true;
if (cost.tier === 'low') return cost.usd !== null && cost.usd <= SKIP_MAX_USD;
return false;
}
export function needConfirm(feature, cost, { memo, session, env = {} } = {}) {
const _of = featureSpec(feature, env);
if (_of.kind === 'local' || _of.kind === 'chat') return false;
if (!canSkip(_of, cost, env)) return true;
if (session && session.has(_of.id)) return false;
if (memo && (memo.get(_of.id) || memo.get('*'))) return false;
return true;
}
export function confirmPlan(feature, { est, env = {}, images = 0 } = {}) {
const _of = featureSpec(feature, env);
const cost = costInfo(_of, est, env);
const _oe = _of.providerLabel || providerName(_of.provider);
const data = (_of.data || 'nội dung anh/chị nhập') + (images ? ` (kèm ${images} ảnh/tệp)` : '');
return {
spec: _of, cost, title: '✨ ' + _of.label,
lines: [
['Gửi tới', _oe],
['Dữ liệu gửi đi', data + ' sẽ được gửi tới ' + _oe + '.'],
['Chi phí', cost.text],
['Ai trả', payerText(_of, env)],
],
canSkip: canSkip(_of, cost, env),
okLabel: cost.tier === 'free' ? 'Tiếp tục' : 'Đồng ý – có thể tốn phí',
blocked: !!cost.over,
};
}
const _o2 = new Set();
export const sessionOk = _o2;
export const memo = {
all() { try { const v = JSON.parse(localStorage.getItem(MEMO_KEY) || '{}'); return v && typeof v === 'object' ? v : {}; } catch { return {}; } },
get(id) { return !!memo.all()[id]; },
set(id, on = true) {
try { const _o9 = memo.all(); if (on) _o9[id] = Date.now(); else delete _o9[id]; localStorage.setItem(MEMO_KEY, JSON.stringify(_o9)); } catch { }
},
clear() { try { localStorage.removeItem(MEMO_KEY); } catch { } _o2.clear(); },
};
export function envFrom(settings) {
try { if (settings && typeof settings.get === 'function') { const v = settings.get('ai.gemini_free', true); if (v && typeof v.then === 'function') return { geminiFree: true }; return { geminiFree: v !== false }; } } catch { }
return { geminiFree: true };
}
export function aiBadge(feature, env = {}) {
const _o4 = badgeInfo(feature, env);
return h('span', { class: 'badge ' + (_o4.paid ? 'badge-warn' : 'badge-gold') + ' ai-badge', 'data-testid': 'ai-badge', 'data-ai-feature': _o4.id,
title: _o4.title, 'aria-label': _o4.text.replace('✨ ', '') + '. ' + _o4.title, style: { marginLeft: '6px', fontSize: '.72rem', padding: '1px 7px', verticalAlign: 'middle' } }, _o4.text);
}
export function paidBadge(title, text = '💳 có thể tốn phí') {
return h('span', { class: 'badge badge-warn cost-badge', 'data-testid': 'cost-badge', title, 'aria-label': text.replace(/^💳\s*/, '') + '. ' + title,
style: { marginLeft: '6px', fontSize: '.72rem', padding: '1px 7px', verticalAlign: 'middle' } }, text);
}
export function markAi(el, feature, env = {}) {
if (!el || (el.querySelector && el.querySelector('.ai-badge'))) return el;
const _o4 = aiBadge(feature, env);
el.appendChild(_o4);
el.dataset.aiFeature = _o4.dataset.aiFeature;
if (!el.title) el.title = _o4.title;
return el;
}
export function aiNote(feature, env = {}) {
const _of = featureSpec(feature, env);
if (_of.kind === 'local') return h('p', { class: 'muted small ai-note', 'data-testid': 'ai-note-local' }, '💻 Chạy trên máy – miễn phí, dữ liệu không ra ngoài.');
if (_of.kind === 'chat') return h('p', { class: 'muted small ai-note', 'data-testid': 'ai-note-chat' }, '💬 ' + payerText(_of, env));
return h('p', { class: 'muted small ai-note', 'data-testid': 'ai-note', 'data-ai-feature': _of.id },
'✨ Dùng AI: ' + (_of.data || 'nội dung anh/chị nhập') + ' sẽ được gửi tới ' + (_of.providerLabel || providerName(_of.provider)) + '. ' + payerText(_of, env));
}
export async function aiConfirm(feature, opts = {}) {
const env = opts.env || {};
const _of = featureSpec(feature, env);
const images = Array.isArray(opts.images) ? opts.images.length : Number(opts.images) || 0;
const est = opts.est !== undefined ? opts.est : (_of.kind === 'text' || _of.kind === 'doc' || _of.kind === 'image' || _of.kind === 'search')
? roughEstimate({ provider: _of.provider, prompt: opts.prompt, images, json: opts.json, free: env.geminiFree }) : null;
const _oc = confirmPlan(_of, { est, env, images });
if (!needConfirm(_of, _oc.cost, { memo, session: _o2, env })) return true;
if (typeof document === 'undefined') return false;
const testid = opts.testid || 'ai-confirm';
const skip = _oc.canSkip ? h('input', { type: 'checkbox', 'data-testid': testid + '-skip' }) : null;
const rows = _oc.lines.map(([k, v]) => h('p', { class: 'ai-line', 'data-k': k }, h('b', null, k + ': '), h('span', { 'data-testid': k === 'Chi phí' ? testid + '-cost' : null }, v)));
return new Promise((resolve) => {
let _og = false;
const _o7 = (v) => { if (_og) return; _og = true; if (v) { if (_oc.canSkip) _o2.add(_of.id); if (skip && skip.checked) memo.set(_of.id, true); } _o9.close(v); resolve(!!v); };
const _oa = h('button', { type: 'button', class: 'btn btn-primary', 'data-testid': testid + '-ok', disabled: _oc.blocked, onclick: () => _o7(true) }, icon('check', 20), h('span', null, _oc.okLabel));
const body = h('div', { class: 'ai-confirm', 'data-testid': testid, 'data-ai-feature': _of.id, 'data-tier': _oc.cost.tier },
opts.lead ? h('p', { class: 'lead' }, opts.lead) : null,
rows,
_oc.blocked ? h('p', { class: 'warn-text', 'data-testid': testid + '-over' }, 'Vượt trần ngân sách AI tháng – không chạy được lần này.') : null,
skip ? h('label', { class: 'ai-skip', style: { display: 'flex', gap: '8px', alignItems: 'center', marginTop: '8px' } }, skip, 'Không hỏi lại cho tính năng này') : null,
h('div', { class: 'btn-row', style: { display: 'flex', gap: '8px', justifyContent: 'flex-end', flexWrap: 'wrap', marginTop: '12px' } },
h('button', { type: 'button', class: 'btn btn-ghost', 'data-testid': testid + '-cancel', onclick: () => _o7(false) }, icon('x', 20), h('span', null, 'Huỷ')), _oa));
const _o9 = modal({ title: opts.title || _oc.title, body, onClose: () => { if (!_og) { _og = true; resolve(false); } } });
});
}
export function cancelError() {
const e = new Error('Đã huỷ – chưa gửi gì tới AI.');
e.code = 'AI_CANCELLED'; e.userMessage = e.message;
return e;
}
export const isCancel = (e) => !!(e && e.code === 'AI_CANCELLED');

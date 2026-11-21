import { t } from './i18n.17f01a0b54.js';
import { word } from './xkit.71d637c634.js';
import { memoryPrompt } from './memory.0e46c2fde6.js';
export const SETTINGS_KEY = 'persona';
export const DEFAULT_PERSONA = { humor: 35, detail: 35, self: 'em', owner: 'anh/chị', customer: 'anh/chị' };
export const AUDIENCES = ['owner', 'customer'];
export const WORDS = {
'persona.title': 'Tính cách trợ lý',
'persona.lead': 'Em xưng "em", gọi anh/chị là "anh/chị". Hai giọng tách bạch: nói với anh/chị thì thoải mái; viết cho khách thì chuyên nghiệp.',
'persona.humor': 'Nghiêm túc ↔ Vui tính',
'persona.detail': 'Ngắn gọn ↔ Chi tiết',
'persona.preview.owner': 'Giọng nói với anh/chị',
'persona.preview.customer': 'Giọng viết cho khách',
'persona.limits': 'Giới hạn cứng (luôn bật)',
'help.persona': 'Chỉnh giọng của trợ lý. Thanh trượt chỉ đổi giọng nói với anh/chị và mức chi tiết; giọng viết cho khách luôn chuyên nghiệp. Giới hạn cứng không tắt được: số liệu đúng có nguồn, không nói tục, không đùa chủ đề nhạy cảm, không giả làm người thật với khách.'
};
export const HARD_LIMITS = [
'Số liệu phải đúng và có nguồn; không có nguồn thì không nêu số, nói "Em chưa tìm được, anh/chị tự nhập giúp em"; không bịa số.',
'Không nói tục, không dùng từ thô.',
'Không đùa về chủ đề nhạy cảm: chính trị, tôn giáo, vùng miền, giới tính, bệnh tật, tai nạn, tài chính của người khác.',
'Với khách: không giả làm người thật; được hỏi thì nói rõ đây là trợ lý soạn giúp; không hứa điều chủ app chưa duyệt.'
];
export function clamp(n, d) { n = Number(n); return Number.isFinite(n) ? Math.max(0, Math.min(100, Math.round(n))) : d; }
export function normalizePersona(p) {
p = p && typeof p === 'object' ? p : {};
return {
humor: clamp(p.humor, DEFAULT_PERSONA.humor), detail: clamp(p.detail, DEFAULT_PERSONA.detail),
self: String(p.self || DEFAULT_PERSONA.self).slice(0, 12), owner: String(p.owner || DEFAULT_PERSONA.owner).slice(0, 12),
customer: String(p.customer || DEFAULT_PERSONA.customer).slice(0, 16)
};
}
export function level(n) { return n < 34 ? 0 : n < 67 ? 1 : 2; }
const _o1 = ['nghiêm túc, đi thẳng vào việc', 'thân thiện, đôi khi dí dỏm nhẹ', 'vui tính, dí dỏm (vẫn đúng việc)'];
const _o0 = ['ngắn gọn: ý chính trước, tối đa vài dòng', 'vừa đủ: ý chính rồi giải thích ngắn', 'chi tiết: đủ bước, có ví dụ'];
export function audienceForTask(task, { json } = {}) {
if (json) return null;
if (task === 'read_policy') return null;
if (task === 'zalo_draft' || task === 'script' || task === 'customer') return 'customer';
return 'owner';
}
export function systemPrompt(audience, { persona, memory, brand = '', ownerName = '', withMemory = true, memoryMax = 1500, kindLabel } = {}) {
const p = normalizePersona(persona);
const _o6 = [];
if (audience === 'customer') {
_o6.push('[Giọng viết cho khách]');
_o6.push('Viết chuyên nghiệp, lịch sự, rõ ràng' + (brand ? ', đúng phong cách thương hiệu "' + brand + '"' : '') + '. Xưng "' + p.self + '", gọi khách là "' + p.customer + '".');
_o6.push('Không đùa, không dùng tiếng lóng, không biểu tượng cảm xúc quá 1 cái. Câu ngắn, có lời mời hành động cụ thể.');
if (ownerName) _o6.push('Ký tên theo hồ sơ: ' + ownerName + '.');
} else {
_o6.push('[Giọng nói với chủ app]');
_o6.push('Xưng "' + p.self + '", gọi chủ app là "' + p.owner + '". Giọng ' + _o1[level(p.humor)] + '. Trả lời ' + _o0[level(p.detail)] + '.');
_o6.push('Làm ở tầm chuyên gia, ưu tiên cách rẻ nhất mà vẫn đạt; việc tự làm được thì làm luôn; việc tốn phí hoặc không đảo ngược thì hỏi trước.');
}
_o6.push('[Giới hạn cứng]');
for (const _o5 of HARD_LIMITS) _o6.push('- ' + _o5);
if (withMemory && memory) {
const _o7 = memoryPrompt(memory, memoryMax, kindLabel);
if (_o7) { _o6.push('[Điều cần nhớ về chủ app]'); _o6.push(_o7); }
}
return _o6.join('\n');
}
export function withSystem(system, prompt) {
if (!system) return prompt;
return system + '\n\n[Yêu cầu]\n' + String(prompt || '');
}
export function signerLine(user, _ob = {}) {
const p = _ob || {}, u = user || {};
const _od = !!(u.role && u.role !== 'owner');
const _o8 = _od ? [u.full_name || u.username || p.name, u.title, u.phone || p.phone] : [p.name || u.full_name, p.title || u.title, p.phone || u.phone];
return _o8.map((x) => String(x || '').trim()).filter(Boolean).join(' – ');
}
export function createPersona({ settings, memory, getUser } = {}) {
const api = {
get() { return normalizePersona(settings.get(SETTINGS_KEY, null)); },
async set(patch) { const _oe = normalizePersona({ ...api.get(), ...patch }); await settings.set(SETTINGS_KEY, _oe); return _oe; },
systemPrompt(audience = 'owner', opts = {}) {
const _ob = settings.get('profile', {}) || {};
return systemPrompt(audience, {
persona: api.get(), memory: memory ? memory.list() : [], brand: word('persona.brand') || String(_ob.company || '').trim(),
ownerName: signerLine(typeof getUser === 'function' ? getUser() : null, _ob),
kindLabel: (k) => t('mem.kind.' + k), ...opts
});
},
prefixFor(task, opts = {}) {
const _o2 = audienceForTask(task, opts);
return _o2 ? api.systemPrompt(_o2) : '';
}
};
return api;
}
export function renderPersonaPanel(body, { ui, persona }) {
const { h, field, toast } = ui;
const p = persona.get();
const _oa = h('pre', { class: 'xp-pre', 'data-testid': 'persona-owner' });
const _o9 = h('pre', { class: 'xp-pre', 'data-testid': 'persona-customer' });
const _o3 = () => { _oa.textContent = persona.systemPrompt('owner', { withMemory: false }); _o9.textContent = persona.systemPrompt('customer', { withMemory: false }); };
const _oc = (key, label) => {
const _o4 = field({ label, type: 'range', value: p[key], min: 0, max: 100, step: 5, id: 'persona-' + key,
onChange: async (_oe) => { await persona.set({ [key]: _oe }); _o3(); toast(t('common.saved'), 'ok'); } });
return _o4;
};
body.append(h('p', { class: 'muted' }, t('persona.lead')),
h('div', { class: 'grid-2' }, _oc('humor', t('persona.humor')), _oc('detail', t('persona.detail'))),
h('div', { class: 'grid-2' },
h('div', null, h('h4', { class: 'section-title' }, t('persona.preview.owner')), _oa),
h('div', null, h('h4', { class: 'section-title' }, t('persona.preview.customer')), _o9)));
_o3();
}
export default { systemPrompt, audienceForTask, normalizePersona, createPersona, renderPersonaPanel, HARD_LIMITS };

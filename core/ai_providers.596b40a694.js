export const LEGACY_LOCAL = 'ollama';
export const ONLINE_AI = ['gemini', 'claude_api'];
export const ONLINE_LABEL = { gemini: 'Gemini', claude_api: 'Claude API' };
export const PAID_NOTE = 'Dịch vụ bên thứ ba – anh/chị trả phí riêng theo gói của hãng (Gemini có gói miễn phí và gói trả phí theo hãng).';
export const isLegacyLocal = (p) => String(p || '').toLowerCase() === LEGACY_LOCAL;
export function connectedOnline(available) {
const _o0 = available && typeof available === 'object' ? available : {};
return [...(_o0.gemini !== false ? ['gemini'] : []), ...(_o0.claude === true ? ['claude_api'] : [])];
}
export function mapLegacyProvider(p, available) {
if (!isLegacyLocal(p)) return p;
const _o1 = connectedOnline(available);
return _o1.includes('gemini') ? 'gemini' : (_o1[0] || 'gemini');
}
export function mapLegacyRoutes(routes, available) {
const _o2 = {};
for (const [k, v] of Object.entries(routes && typeof routes === 'object' ? routes : {})) _o2[k] = mapLegacyProvider(v, available);
return _o2;
}
export function providerName(p) {
if (isLegacyLocal(p)) return 'AI trên máy (bản cũ, đã ngừng)';
return ONLINE_LABEL[p] || { handoff_claude: 'Claude (chat)', handoff_gemini: 'Gemini (chat)', handoff: 'Chat', app: 'dữ liệu app' }[p] || String(p || '');
}
export function onlineChoices(available, current) {
const _o1 = connectedOnline(available);
const none = !_o1.length;
const options = none ? [['gemini', 'Gemini – chưa nối (nối ở Cài đặt › Kết nối)']] : _o1.map((p) => [p, ONLINE_LABEL[p]]);
const cur = mapLegacyProvider(current, available);
const value = options.some((o) => o[0] === cur) ? cur : options[0][0];
return { options, value, note: PAID_NOTE, none };
}

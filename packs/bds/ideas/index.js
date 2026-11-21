import { kit, h } from '../_lib/kit.js';
import { mountIdeas, ideasSelftest } from './ideas_tab.js';
import { mountVideoAi, videoAiSelftest } from './videoai_tab.js';
import { mountClips } from './clips_tab.js';
const _o0 = 'bds-ideas-css';
function ensureCss() {
if (typeof document === 'undefined' || document.getElementById(_o0)) return;
document.head.appendChild(h('link', { id: _o0, rel: 'stylesheet', href: new URL('./ideas.css', import.meta.url).href }));
}
export const TABS = [['ideas', '💡 Ý tưởng'], ['video', '✨ Video AI'], ['clips', '🎞️ Clip đã có']];
export async function mount(el, ctx) {
ensureCss();
const K = kit(ctx);
const _o8 = ctx.route && ctx.route.query;
const get = (k) => (_o8 && typeof _o8.get === 'function' ? _o8.get(k) : null);
const _o5 = get('input') || '';
let _ob = TABS.some(([k]) => k === get('tab')) ? get('tab') : (_o5 ? 'video' : 'ideas');
if (get('id') || get('batch')) _ob = 'ideas';
el.innerHTML = '';
const _o7 = Object.fromEntries(TABS.map(([k]) => [k, h('div', { class: 'ix-pane', 'data-testid': 'ix-pane-' + k, role: 'tabpanel', hidden: true })]));
const bar = h('div', { class: 'ix-tabs', role: 'tablist', 'aria-label': 'Ý tưởng & Video AI', 'data-testid': 'ix-tabs' },
TABS.map(([k, label]) => h('button', { type: 'button', role: 'tab', 'aria-selected': 'false', 'data-v': k, 'data-testid': 'ix-tab-' + k, onclick: () => _oa(k) }, label)));
el.appendChild(h('div', { class: 'bds-screen', 'data-testid': 'ideas-video-screen' },
h('div', { class: 'bds-head' }, h('h2', null, 'Ý tưởng & Video AI')),
h('p', { class: 'bds-muted' }, 'Lấy ý tưởng, chấm điểm, duyệt → làm video bằng AI (Gemini, Flow) → tải bộ mảnh ghép trong CapCut; clip lưu kèm link để xem và tải.'),
bar, ...TABS.map(([k]) => _o7[k])));
const _o6 = {};
const _o3 = (k) => {
if (!_o6[k]) {
_o6[k] = (k === 'ideas' ? mountIdeas(_o7.ideas, ctx, K, { onMakeVideo })
: k === 'video' ? mountVideoAi(_o7.video, ctx, K, { fn: get('fn') || '', onSaved: () => { if (_o6.clips) _o6.clips.then((c) => c && c.render && c.render()); }, openClips: () => _oa('clips') })
: mountClips(_o7.clips, ctx, K, { openVideo: () => _oa('video') }))
.catch((e) => { _o7[k].replaceChildren(K.empty('Chưa mở được thẻ này: ' + ((e && e.message) || e))); return null; });
}
return _o6[k];
};
async function _oa(k) {
_ob = k;
for (const [id, p] of Object.entries(_o7)) p.hidden = id !== k;
for (const _o2 of bar.children) _o2.setAttribute('aria-selected', String(_o2.dataset.v === k));
return _o3(k);
}
async function onMakeVideo(i) {
const _o1 = await _oa('video');
if (_o1 && _o1.prefill) _o1.prefill({ idea: { id: i.id, title: i.title, summary: i.summary, url: i.url } });
try { bar.scrollIntoView({ block: 'start' }); } catch { }
}
const _o1 = await _oa(_ob);
if (_ob === 'video' && _o5 && _o1 && _o1.prefill) _o1.prefill({ text: _o5 });
}
export default {
manifest: {
id: 'ideas', title: 'Ý tưởng & Video AI', icon: '💡', screen: 'content', order: 10, version: '2.0.0', status: 'ready', requires: 'video',
help: 'Một màn 3 thẻ. Ý tưởng: dán link/chủ đề/ảnh, tự phân loại, chặn trùng, chấm điểm, duyệt hàng loạt, theo dõi chủ đề → "Làm video AI từ ý tưởng này". Video AI hỏi "Anh/chị muốn làm video dạng nào?" – 3 dạng: Phân tích thị trường (link → AI phân tích quy hoạch, giá vàng, lãi suất, tín dụng, pháp lý → ý tưởng → prompt tổng; số trong link hoặc hỏi Gemini lấy số mới), Bản đồ quy hoạch, metro (AI rút tên địa điểm → bản đồ vẽ từ dữ liệu OpenStreetMap, anh/chị duyệt khu), Giới thiệu căn hộ (thông tin + ảnh căn → nhân vật ảo đi dạo trong căn). Nhân vật: Gemini tạo ảnh, xem trước, tạo lại hoặc tải ảnh của anh/chị; hoặc không người. Clip: thủ công qua Flow hoặc tự động qua khoá Gemini (báo chi phí trước). Bộ mảnh cho CapCut (Thử nghiệm): clip, ảnh bản đồ, lời đọc, phụ đề, thứ tự cảnh. Dịch vụ AI bên ngoài trả phí riêng theo gói của Google. Clip đã có: bản ghi link, câu lệnh, chi phí, ngày – xem/tải, lên lịch đăng.',
},
mount,
async selftest(ctx) {
const details = [];
const _o9 = ctx && ctx.store;
for (const _o4 of ['list', 'get', 'put']) if (!_o9 || typeof _o9[_o4] !== 'function') details.push('Thiếu store.' + _o4);
details.push(...ideasSelftest(), ...videoAiSelftest());
return { ok: !details.length, details: details.length ? details : ['Ý tưởng & Video AI: logic OK'] };
},
};

import { walkPath } from './plan3d.js';
export const FLOW_SECONDS = 8;
export const LABEL = 'Video minh hoạ';
export const AI_REMINDER = 'Khi đăng, tự bật nhãn nội dung AI trên mạng xã hội.';
const _o1 = (s) => String(s ?? '').replace(/\*\*/g, '').replace(/\s+/g, ' ').trim();
const _o4 = (ch) => (ch && _o1(ch.lock_en)) ? `CHARACTER LOCK (keep 100% identical): ${_o1(ch.lock_en)}\nREFERENCE: use the "${_o1(ch.name) || 'character'}" reference images from Ingredients – same face, hair, outfit and body proportions.` : 'CHARACTER: a well-dressed Vietnamese real-estate consultant in smart business attire, friendly and confident.';
export function splitVoice(text, seconds = FLOW_SECONDS, wps = 3) {
const _o5 = Math.floor(seconds * wps);
const words = _o1(text).split(' ').filter(Boolean);
const _o6 = []; let _o2 = [];
for (const w of words) {
_o2.push(w);
if (_o2.length >= _o5 || (/[.!?…]$/.test(w) && _o2.length >= _o5 * 0.6)) { _o6.push(_o2.join(' ')); _o2 = []; }
}
if (_o2.length) _o6.push(_o2.join(' '));
return _o6;
}
export function presenterIntro({ character = null, project = '', backdrop = '', script = '' } = {}) {
const say = _o1(script) || `Xin chào anh chị, hôm nay mình cùng tìm hiểu ${_o1(project) || 'dự án'} – vị trí, tiện ích và chính sách bán hàng mới nhất.`;
const _o7 = splitVoice(say);
const set = _o1(backdrop) || (project ? `the entrance plaza of a modern high-rise residential project in Vietnam, blurred towers in the background` : 'a bright, modern real-estate showroom with a blurred city skyline window');
const scenes = _o7.map((line, i) => ({
id: 'g5_dan_' + (i + 1),
title: { kicker: i === 0 ? 'Người dẫn' : '', text: i === 0 ? (_o1(project) || 'Giới thiệu') : '' },
subs: [line], dur: FLOW_SECONDS,
studio: { kind: 'nhan_vat', engine: 'ai', provider: 'flow', g5: { type: 'presenter_intro', level: 1, part: i + 1, of: _o7.length, character_id: character && character.id || '' } },
label: LABEL,
}));
const prompts = _o7.map((line, i) => [
`Vertical 9:16 video, ${FLOW_SECONDS} seconds, 1080x1920, photorealistic.`,
_o4(character),
`SETTING: ${set}.`,
`SHOT ${i + 1}/${_o7.length}: medium shot, the presenter stands facing the camera and speaks naturally with small hand gestures${i === 0 ? ', gentle smile and a slight nod at the start' : ''}${i === _o7.length - 1 ? ', ends with an inviting open-palm gesture' : ''}. Static tripod camera, eye level, 35mm lens, shallow depth of field.`,
`LIP-SYNC CONTEXT (Vietnamese voice-over added later, do not render text): "${line}"`,
'LIGHT & SOUND: soft key light, natural skin tones; room tone only, no music.',
'AVOID: no on-screen text, no captions, no logos, no watermarks, no "AI" labels, no extra people, no distorted hands or faces.',
].join('\n'));
return { level: 1, scenes, prompts, voice: character && character.voice || '', lines: _o7, reminder: AI_REMINDER, label: LABEL };
}
const _o0 = { sanh: 'entrance foyer', hanhlang: 'hallway', khach: 'living room', bep: 'kitchen and dining area', ngu: 'bedroom', wc: 'bathroom', bancong: 'balcony (loggia)', lamviec: 'study room' };
export function tour3d({ character = null, plan, apartment = {} } = {}) {
const _o8 = walkPath(plan || { rooms: [] }).filter((p) => p.stop);
const rooms = Object.fromEntries(((plan && plan.rooms) || []).map((_o9) => [_o9.id, _o9]));
const style = _o1(apartment.style) || 'modern, warm and minimal interior';
const _ob = _o8.filter((p, i) => i === 0 || p.room !== _o8[i - 1].room || p.name === 'Cửa vào');
const scenes = [], prompts = [];
_ob.forEach((p, i) => {
const _o9 = rooms[p.room] || {};
const _o3 = p.name === 'Cửa vào' ? 'front door of the apartment' : (_o0[_o9.kind] || 'room');
const _oa = _o9.w && _o9.d ? ` about ${String(_o9.w).replace('.', ',')} m × ${String(_o9.d).replace('.', ',')} m` : '';
scenes.push({
id: 'g5_tour_' + (i + 1),
title: { kicker: i === 0 ? 'Dẫn tour căn' : '', text: p.name || _o9.name || '' },
subs: [p.say || ''], dur: FLOW_SECONDS,
studio: { kind: 'nhan_vat', engine: 'ai', provider: 'flow', g5: { type: 'tour3d', level: 3, room: p.room, step: i + 1, of: _ob.length, character_id: character && character.id || '' } },
label: LABEL,
});
prompts.push([
`Vertical 9:16 video, ${FLOW_SECONDS} seconds, 1080x1920, photorealistic real-estate walkthrough.`,
_o4(character),
`SETTING LOCK: the same ${_o1(apartment.type) || 'apartment'}${apartment.project ? ' in a high-rise residential project in Vietnam' : ''}, ${style}; identical materials and daylight in every scene.`,
`SCENE ${i + 1}/${_ob.length} – ${_o3}${_oa}: the presenter ${i === 0 ? 'opens the door and welcomes the viewer inside' : 'walks in from the previous room, gestures to the space while speaking'}.`,
`CAMERA: steady gimbal following shot at eye level, 24mm lens, smooth, no cuts.`,
`CONTINUITY: ${i === 0 ? 'first scene of a continuous tour' : 'starts where the previous scene ended'}${i < _ob.length - 1 ? '; ends heading toward the next room' : '; ends on a calm wide shot'}.`,
`CONTEXT (Vietnamese voice-over, do not render as text): "${_o1(p.say)}"`,
'AVOID: no on-screen text, no logos, no watermarks, no "AI" labels, no extra people, no distorted hands or faces.',
].join('\n'));
});
return { level: 3, scenes, prompts, voice: character && character.voice || '', lines: scenes.map((s) => s.subs[0]), reminder: AI_REMINDER, label: LABEL, waypoints: walkPath(plan || { rooms: [] }) };
}
export const G5_SCENE_TEMPLATES = [
{ id: 'g5_dan_mo_dau', icon: '🧑‍💼', label: 'Người dẫn giới thiệu (mức 1)', desc: 'Nhân vật đứng nói vào ống kính trước phông dự án – Flow/Veo', level: 1,
make(cfg = {}, opts = {}) { const _o9 = presenterIntro({ project: cfg.title || cfg.project || '', ...opts }); return { items: [], scene: _o9.scenes[0], scenes: _o9.scenes, prompts: _o9.prompts }; } },
{ id: 'g5_tour_3d', icon: '🏠', label: 'Dẫn tour căn 3D (mức 3)', desc: 'Nhân vật đi qua từng phòng theo mặt bằng 3D – mỗi phòng 1 cảnh 8 giây', level: 3,
make(cfg = {}, opts = {}) { const _o9 = tour3d(opts); return { items: [], scene: _o9.scenes[0] || null, scenes: _o9.scenes, prompts: _o9.prompts }; } },
];

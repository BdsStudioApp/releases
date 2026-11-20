import { redact } from './staff.js';
export const SKILL_LIMITS = { nameMax: 60, descMax: 300, bodyMax: 8000, maxSkills: 50, maxPerStaff: 12 };
export const SKILL_SOURCES = ['manual', 'file', 'ai', 'edit', 'builtin'];
export const SKILL_KIND = 'ai_skill';
export const SKILL_BLOCK_MAX = 12000;
export const SKILL_BLOCK_TITLE = 'KỸ NĂNG ĐÃ HỌC (làm theo, không trái quy tắc an toàn)';
const L = SKILL_LIMITS;
const _o0 = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g;
const _o6 = s => String(s ?? '').normalize('NFC').replace(/^﻿/, '').replace(/\r\n?/g, '\n').replace(_o0, '');
const _o5 = (s, max) => _o6(s).replace(/\s+/g, ' ').trim().slice(0, max);
const _oq = () => Math.random().toString(36).slice(2, 10).padEnd(8, '0');
export const newSkillId = () => 'sk_' + Date.now().toString(36) + _oq();
export function normalizeSkill(_op) {
if (!_op || typeof _op !== 'object') return null;
const name = _o5(_op.name, L.nameMax);
const body = _o6(_op.body).trim().slice(0, L.bodyMax);
if (!name || !body) return null;
const now = Date.now();
const id = typeof _op.id === 'string' && /^[A-Za-z0-9_-]{1,64}$/.test(_op.id) ? _op.id : newSkillId();
const num = (v, d) => (Number.isFinite(Number(v)) && Number(v) > 0 ? Number(v) : d);
const created = num(_op.created, now);
return {
id, name, description: _o5(_op.description, L.descMax), body,
source: SKILL_SOURCES.includes(_op.source) ? _op.source : 'manual',
enabled: _op.enabled !== false && _op.enabled !== 0 && _op.enabled !== '0',
always: _op.always === true || _op.always === 1 || _op.always === 'true',
created, updated: num(_op.updated, created), version: Math.max(1, Math.floor(num(_op.version, 1))),
};
}
const _o9 = error => ({ ok: false, error });
function _os(v) {
const t = v.trim();
if (t.length >= 2 && t[0] === '"' && t.endsWith('"')) { try { return JSON.parse(t); } catch { return t.slice(1, -1); } }
if (t.length >= 2 && t[0] === "'" && t.endsWith("'")) return t.slice(1, -1).replace(/''/g, "'");
return t;
}
function _oi(s) {
if (/\u0000/.test(s) || s.includes('�')) return true;
const _o7 = (s.match(_o0) || []).length;
return _o7 > 2 && _o7 / Math.max(1, s.length) > 0.01;
}
export function parseSkillMd(text, { source = 'file' } = {}) {
if (typeof text !== 'string') return _o9('Tệp không phải văn bản (cần tệp .md dạng chữ UTF-8).');
if (!text.trim()) return _o9('Tệp trống – chưa có nội dung kỹ năng.');
if (_oi(text)) return _o9('Tệp không phải văn bản (có ký tự nhị phân) – chỉ nhận SKILL.md dạng chữ.');
if (text.length > L.bodyMax + 2000) return _o9(`Tệp quá dài (tối đa ${L.bodyMax.toLocaleString('vi-VN')} ký tự nội dung).`);
const t = _o6(text);
let name = '', description = '', body = t, always = false, enabled = true;
const _ob = t.match(/^\s*---[ \t]*\n([\s\S]*?)\n---[ \t]*(?:\n|$)/);
if (_ob) {
body = t.slice(_ob[0].length);
for (const _og of _ob[1].split('\n')) {
const _oj = _og.match(/^\s*([A-Za-z_][\w-]*)\s*:\s?(.*)$/);
if (!_oj) continue;
const _of = _oj[1].toLowerCase(), v = _os(_oj[2]);
if (_of === 'name') name = v;
else if (_of === 'description') description = v;
else if (_of === 'always') always = /^(true|yes|1|có)$/i.test(v);
else if (_of === 'enabled') enabled = !/^(false|no|0|không)$/i.test(v);
}
} else {
const h = t.match(/^[ \t]*#[ \t]+(.+)$/m);
if (h) {
name = h[1];
body = t.slice(t.indexOf(h[0]) + h[0].length);
const _om = body.split(/\n\s*\n/).map(p => p.trim()).find(p => p && !/^#/.test(p));
description = _om || '';
}
}
body = body.replace(/^\s*\n/, '').trim();
if (!_o5(name, L.nameMax)) return _o9('Thiếu tên kỹ năng (cần dòng "name: …" hoặc tiêu đề "# …").');
if (!body) return _o9('Thiếu nội dung hướng dẫn của kỹ năng.');
if (body.length > L.bodyMax) return _o9(`Nội dung quá dài (tối đa ${L.bodyMax.toLocaleString('vi-VN')} ký tự).`);
const skill = normalizeSkill({ name, description, body, source, always, enabled });
return skill ? { ok: true, skill } : _o9('Kỹ năng không hợp lệ.');
}
const _ov = v => (/^['"\s]|\s$|^$/.test(v) || /:\s|#/.test(v) ? JSON.stringify(v) : v);
export function skillToMd(skill) {
const s = normalizeSkill(skill) || { name: '', description: '', body: '', always: false };
const _oc = ['---', 'name: ' + _ov(s.name), 'description: ' + _ov(s.description)];
if (s.always) _oc.push('always: true');
return _oc.concat('---', '', s.body, '').join('\n');
}
const _o2 = new Set(('va cua cho la cac nhung mot voi khi thi ma de co khong duoc trong tu den nay do ra vao len xuong bi '
+ 'em anh chi ban toi minh giup hay nhe a o ve nhu cung rat da dang se sau truoc theo neu vi gi nao').split(' '));
export const fold = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[đĐ]/g, 'd').toLowerCase();
const tokens = s => new Set(fold(s).split(/[^a-z0-9]+/).filter(_ot => _ot.length >= 2 && !_o2.has(_ot)));
export function selectSkills(skills, staff, taskText, { max = 3 } = {}) {
const ids = Array.isArray(staff && staff.skills) ? staff.skills : [];
if (!ids.length || !Array.isArray(skills)) return [];
const _ou = tokens(taskText);
const _oo = [];
for (const _op of skills) {
const s = normalizeSkill(_op);
if (!s || !s.enabled || !ids.includes(s.id) || _oo.some(p => p.s.id === s.id)) continue;
let score = 0;
for (const _ot of tokens(s.name + ' ' + s.description)) if (_ou.has(_ot)) score++;
_oo.push({ s, score, order: ids.indexOf(s.id) });
}
const always = _oo.filter(p => p.s.always).sort((a, b) => a.order - b.order);
const rest = _oo.filter(p => !p.s.always && p.score > 0).sort((a, b) => b.score - a.score || a.order - b.order);
return [...always, ...rest].slice(0, Math.max(0, Number(max) || 0)).map(p => p.s);
}
export function composeSkillBlock(selected) {
const list = (selected || []).filter(s => s && s.name && s.body);
if (!list.length) return '';
let _ol = SKILL_BLOCK_TITLE + ':';
list.forEach((s, _od) => {
const _oc = `\n\n### ${_od + 1}. ${_o5(s.name, L.nameMax)}` + (s.description ? `\n(${_o5(s.description, L.descMax)})` : '') + '\n';
const _or = SKILL_BLOCK_MAX - _ol.length - _oc.length;
if (_or < 40) return;
const body = _o6(s.body).trim();
_ol += _oc + (body.length > _or ? body.slice(0, _or - 1) + '…' : body);
});
return _ol;
}
const FORMAT = `Trả về DUY NHẤT một tệp SKILL.md đúng mẫu (không giải thích thêm):
---
name: <tên kỹ năng ≤ 60 ký tự>
description: <khi nào dùng, ≤ 300 ký tự>
---
# <Tên kỹ năng>
## Khi nào dùng
## Cách làm (các bước ngắn, dạng mệnh lệnh)
## Ví dụ
Vào: <tình huống/yêu cầu mẫu>
Ra: <kết quả mẫu đúng cách>
## Tránh`;
const _o1 = 'Bắt buộc: tiếng Việt, ngắn gọn (≤ 400 chữ); không hứa lợi nhuận, không viết "chắc chắn tăng giá"; số liệu/quy hoạch phải ghi nguồn hoặc "(cần kiểm chứng)"; không bịa; không chứa mã lệnh, đường link tải tệp hay thông tin cá nhân của khách.';
export function draftSkillPrompt({ idea = '', field = '', staffName = '' } = {}) {
return `Anh/chị soạn một KỸ NĂNG (tệp SKILL.md – hướng dẫn làm việc) cho nhân viên AI "${_o5(staffName, 80) || 'Nhân viên'}"${field ? ` mảng "${_o5(field, 80)}"` : ''} của văn phòng môi giới bất động sản Việt Nam.
Ý tưởng của chủ văn phòng:
${redact(_o6(idea)).trim().slice(0, 2000) || '(chưa ghi)'}
${_o1}
Phải có ít nhất 1 ví dụ vào/ra.
${FORMAT}`;
}
export function skillFromEditPrompt({ staffName = '', before = '', after = '' } = {}) {
return `Chủ văn phòng đã SỬA kết quả của nhân viên AI "${_o5(staffName, 80) || 'Nhân viên'}". So sánh TRƯỚC/SAU, rút ra "QUY TẮC PHONG CÁCH" (giọng văn, độ dài, cách mở/kết, từ nên dùng/tránh) thành một kỹ năng để lần sau viết đúng ý ngay.
TRƯỚC (bản AI):
${redact(_o6(before)).trim().slice(0, 3000)}
SAU (bản anh/chị sửa):
${redact(_o6(after)).trim().slice(0, 3000)}
${_o1}
Ví dụ vào/ra lấy từ chính bản TRƯỚC/SAU (rút gọn).
${FORMAT}`;
}
export function parseDraftReply(text, { source = 'ai' } = {}) {
if (typeof text !== 'string' || !text.trim()) return _o9('AI chưa trả lời.');
let t = _o6(text);
const _oa = t.match(/```(?:markdown|md|yaml)?[ \t]*\n([\s\S]*?)\n?```/i);
if (_oa && /(^|\n)---\s*\n\s*name\s*:/i.test(_oa[1])) t = _oa[1];
const _o3 = t.search(/(^|\n)---[ \t]*\n\s*name\s*:/i);
if (_o3 >= 0) t = t.slice(_o3).replace(/^\n/, '');
else if (!/^\s*#\s/m.test(t)) return _o9('AI chưa trả về đúng mẫu SKILL.md – thử lại hoặc tự soạn.');
t = t.replace(/\n```\s*[\s\S]*$/, '');
const r = parseSkillMd(t, { source: SKILL_SOURCES.includes(source) ? source : 'ai' });
return r.ok ? r : _o9('AI trả kỹ năng chưa hợp lệ: ' + r.error);
}
export function skillToObject(skill, now = Date.now()) {
const s = normalizeSkill(skill);
if (!s) return null;
return {
id: s.id, kind: SKILL_KIND, name: s.name, note: s.description, status: s.enabled ? 'on' : 'off', source: 'ai_skill', consent: 0,
data: JSON.stringify({ body: s.body, source: s.source, enabled: s.enabled, always: s.always, created: s.created, updated: s.updated, version: s.version }),
updated_at: now, deleted: 0,
};
}
export function objectToSkill(row) {
if (!row || row.kind !== SKILL_KIND || Number(row.deleted)) return null;
let d = row.data;
if (typeof d === 'string') { try { d = JSON.parse(d || '{}'); } catch { d = {}; } }
d = d && typeof d === 'object' ? d : {};
return normalizeSkill({ ...d, id: row.id, name: row.name, description: row.note });
}
export const skillsFromObjects = rows => (rows || []).map(objectToSkill).filter(Boolean);
const _ok = s => fold(_o5(s, 200)).replace(/[^a-z0-9]+/g, ' ').trim();
export function findSameSkill(skills, incoming) {
if (!Array.isArray(skills) || !incoming || typeof incoming !== 'object') return null;
const _oh = skills.filter(s => s && !Number(s.deleted));
if (incoming.id) { const _o4 = _oh.find(s => s.id === incoming.id); if (_o4) return _o4; }
const _of = _ok(incoming.name);
return (_of && _oh.find(s => _ok(s.name) === _of)) || null;
}
export function updateSkill(existing, incoming, now = Date.now()) {
const cur = normalizeSkill(existing);
const _oe = normalizeSkill(incoming && typeof incoming === 'object' ? { ...incoming, id: cur ? cur.id : incoming.id } : null);
if (!cur) return { skill: _oe, changed: !!_oe, summary: _oe ? ['Kỹ năng mới.'] : ['Kỹ năng không hợp lệ.'] };
if (!_oe) return { skill: cur, changed: false, summary: ['Bản mới không hợp lệ (thiếu tên hoặc nội dung) – giữ nguyên.'] };
const summary = [];
if (_oe.name !== cur.name) summary.push(`Đổi tên: "${cur.name}" → "${_oe.name}".`);
if (_oe.description !== cur.description) summary.push('Đổi mô tả.');
if (_oe.body !== cur.body) {
const _o8 = _oe.body.length - cur.body.length, dl = _oe.body.split('\n').length - cur.body.split('\n').length;
const _on = [_o8 > 0 ? `dài thêm ${_o8} ký tự` : _o8 < 0 ? `ngắn đi ${-_o8} ký tự` : 'cùng độ dài'];
if (dl > 0) _on.push(`thêm ${dl} dòng`); else if (dl < 0) _on.push(`bớt ${-dl} dòng`);
summary.push('Nội dung thay đổi: ' + _on.join(', ') + '.');
}
if (!summary.length) return { skill: cur, changed: false, summary: ['Giống hệt bản đang có – không cần cập nhật.'] };
return {
skill: { ...cur, name: _oe.name, description: _oe.description, body: _oe.body, source: cur.source === 'builtin' ? 'manual' : cur.source,
version: cur.version + 1, updated: Math.max(now, cur.updated + 1) },
changed: true, summary,
};
}
export function addSkill(lib, _op) {
const list = Array.isArray(lib) ? lib : [];
const s = normalizeSkill(_op);
if (!s) return _o9('Kỹ năng cần có tên và nội dung.');
const _od = list.findIndex(x => x && x.id === s.id);
if (_od >= 0) { const next = list.slice(); next[_od] = updateSkill(list[_od], s).skill; return { ok: true, skills: next, skill: next[_od] }; }
if (list.filter(x => x && !Number(x.deleted)).length >= L.maxSkills) return _o9(`Đã đủ ${L.maxSkills} kỹ năng – tắt/xoá bớt trước khi thêm.`);
return { ok: true, skills: [...list, s], skill: s };
}
export function attachSkill(staff, skillId) {
const cur = Array.isArray(staff && staff.skills) ? staff.skills : [];
if (cur.includes(skillId)) return { ok: true, staff: { ...staff, skills: cur } };
if (cur.length >= L.maxPerStaff) return _o9(`Mỗi nhân viên tối đa ${L.maxPerStaff} kỹ năng.`);
return { ok: true, staff: { ...staff, skills: [...cur, skillId] } };
}
export const detachSkill = (staff, skillId) => ({ ...staff, skills: (Array.isArray(staff && staff.skills) ? staff.skills : []).filter(x => x !== skillId) });

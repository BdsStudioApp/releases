import { skillsFromObjects, skillToObject, SKILL_KIND } from '../_lib/staff_skills.js';
export async function listSkills(K) {
return skillsFromObjects(await K.list('objects')).sort((a, b) => String(a.name).localeCompare(String(b.name), 'vi'));
}
export async function saveSkill(K, skill) {
const row = skillToObject(skill);
if (!row) throw new Error('Kỹ năng thiếu tên hoặc nội dung');
await K.put('objects', row);
const _o0 = { ...skill };
delete _o0.builtin;
return _o0;
}
export async function deleteSkill(K, id) {
const row = await K.get('objects', id);
if (!row || row.kind !== SKILL_KIND) return false;
await K.put('objects', { ...row, deleted: 1 });
return true;
}

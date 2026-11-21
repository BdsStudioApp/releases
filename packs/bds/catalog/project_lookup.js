import { ACTION_NEW } from './research_new_logic.js';
import { parseStructureLines, structStats } from './structure_logic.js';
export const LOOKUP_STRUCTURE = { zones: true, towers: true, floors: true, axes: false };
export function structureOf(_o3) {
if (!_o3 || typeof _o3.text !== 'string') return null;
const sr = parseStructureLines(_o3.text, { sources: _o3.sources || [] }, { via: 'api', now: Date.now() });
return !sr.noWeb && sr.kept ? sr : null;
}
export function projectLookup(base) {
return {
id: 'thong_tin_du_an',
status: (K, opts) => base.status(K, opts),
async find(K, name, opts = {}) {
let _o4 = null;
const _o0 = Object.create(K);
_o0.api = async (action, p = {}) => {
const _o1 = action === ACTION_NEW && p.estimate_only !== true;
const _o3 = await K.api(action, _o1 ? { ...p, structure: { ...LOOKUP_STRUCTURE } } : p);
if (_o1) _o4 = _o3;
return _o3;
};
const _o2 = await base.find(_o0, name, opts);
const sr = _o2 && _o2.fields ? structureOf(_o4) : null;
if (sr) { _o2.structure = sr.st; _o2.structureStats = structStats(sr.st); _o2.structureDropped = sr.dropped; }
return _o2;
}
};
}

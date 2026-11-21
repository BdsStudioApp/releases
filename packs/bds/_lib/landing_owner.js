const _o5 = (ctx) => (ctx && ctx.user && ctx.user.role) || 'owner';
export const meId = (ctx) => String((ctx && ctx.user && ctx.user.id) || '');
export const isAdmin = (ctx) => _o5(ctx) === 'owner';
export const isStaff = (ctx) => ['owner', 'manager'].includes(_o5(ctx));
export function canPublish(ctx) {
if (isAdmin(ctx)) return true;
const _o4 = ctx && ctx.user && ctx.user.perms;
return !!_o4 && _o4.landing_publish === true && _o4.landing !== false;
}
export const ownerOf = (cfg) => String((cfg && cfg.owner_uid) || '');
export const isCompanyPage = (cfg) => !ownerOf(cfg);
export function canEdit(ctx, cfg) { return isAdmin(ctx) || (canPublish(ctx) && !!meId(ctx) && ownerOf(cfg) === meId(ctx)); }
export function visiblePages(ctx, list) { return isAdmin(ctx) ? (list || []) : (list || []).filter((_o1) => canEdit(ctx, _o1)); }
export function stampOwner(ctx, cfg) {
if (!cfg || isAdmin(ctx) || ownerOf(cfg)) return cfg;
return { ...cfg, owner_uid: meId(ctx) };
}
export function ownerLabel(cfg, names = {}) {
const uid = ownerOf(cfg);
if (!uid) return 'Người tạo: Quản trị';
return 'Người tạo: ' + (names[uid] || 'nhân viên');
}
export function cloneAsMine(ctx, cfg, newId, code = '') {
const _o6 = String(code || newId || '').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 6) || 'cua-toi';
const _o0 = String((cfg && cfg.slug) || 'trang').slice(0, 40).replace(/-+$/, '');
return { ...cfg, id: newId, owner_uid: meId(ctx), name: String((cfg && cfg.name) || 'Trang') + ' (bản của tôi)', slug: _o0 + '-' + _o6, published: {}, updated_at: Date.now() };
}
export const OWNER_ALL = '', OWNER_COMPANY = '_cty';
export function filterByOwner(list, v) {
if (!v) return list || [];
return (list || []).filter((_o1) => (v === OWNER_COMPANY ? isCompanyPage(_o1) : ownerOf(_o1) === v));
}
export function ownersIn(list) {
const _o3 = [];
for (const _o1 of list || []) { const _o2 = ownerOf(_o1) || OWNER_COMPANY; if (!_o3.includes(_o2)) _o3.push(_o2); }
return _o3;
}

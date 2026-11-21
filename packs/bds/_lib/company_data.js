import { h } from './kit.js';
export function companyDataLine(ctx) {
const _o0 = ctx && ctx.company;
if (!_o0) return '';
const name = String(_o0.name || '').trim();
return 'Khách anh/chị thêm vào đây là dữ liệu của ' + (name ? 'công ty ' + name : 'công ty') + ': Quản trị xem và chuyển được; nghỉ việc không mang theo.';
}
export function companyDataNote(ctx, opts = {}) {
const _o1 = companyDataLine(ctx);
if (!_o1) return null;
return h('p', { class: opts.cls || 'bds-muted', 'data-testid': opts.testid || 'company-data-note' }, _o1);
}

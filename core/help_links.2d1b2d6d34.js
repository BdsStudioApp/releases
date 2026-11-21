export const HELP_BASE_DEFAULT = 'https://bdsstudio.app/huong-dan/';
export const HELP_LABEL = '📖 Hướng dẫn';
export const HELP_PAGES_BY_ROUTE = {
'home': 'README',
'customers': 'them-khach',
'customers/customers': 'them-khach',
'customers/care': 'nhac-viec-lich-hen',
'customers/zalo': 'goi-nhan-zalo',
'customers/landing_builder': 'tao-landing',
'customers/lead_pool': 'cong-ty-kho-lead',
'customers/members': 'cong-ty-khach-toan-cong-ty',
'sales/catalog': 'thong-tin-du-an',
'sales/units': 'len-can',
'sales/quote': 'bao-gia-may-tinh-vay',
'sales/loan': 'bao-gia-may-tinh-vay',
'customers/g4_doitac': 'so-doi-tac',
'sales/g4_doitac': 'so-doi-tac',
'content': 'y-tuong-noi-dung',
'content/ideas': 'y-tuong-noi-dung',
'settings/license': 'ban-quyen',
'settings/maintenance': 'sao-luu-khoi-phuc',
'settings/security': 'doi-may',
'settings/users': 'cong-ty-moi-nhan-vien',
'settings/packs': 'gop-y-goi-thu-nghiem',
'settings/feedback': 'gop-y-goi-thu-nghiem',
'settings/version': 'cai-app'
};
export const HELP_PAGES_BY_KEY = {
license: 'ban-quyen',
maintenance: 'sao-luu-khoi-phuc',
lock: 'doi-may',
users: 'cong-ty-moi-nhan-vien',
feedback: 'gop-y-goi-thu-nghiem',
version: 'cai-app',
cai_may_tinh: 'cai-tren-may-tinh'
};
let base = '';
export function setHelpConfig(cfg = {}) {
const b = String((cfg && cfg.HELP_BASE) || '').trim();
if (/^https:\/\/[^\s]+$/i.test(b)) base = b.endsWith('/') ? b : b + '/';
else if (cfg && cfg.edition && cfg.edition !== 'owner') base = (typeof location !== 'undefined' && /^https?:$/.test(location.protocol) ? location.origin + '/huong-dan/' : HELP_BASE_DEFAULT);
else base = '';
return base;
}
export const helpBase = () => base;
export function helpUrl(page) {
if (!base || !page) return '';
return page === 'README' ? base : base + encodeURIComponent(page);
}
export function helpPageForRoute(r = {}) {
const _o0 = String(r.screen || ''), m = String(r.module || '');
return (m && HELP_PAGES_BY_ROUTE[_o0 + '/' + m]) || HELP_PAGES_BY_ROUTE[_o0] || '';
}
export const helpPageForKey = (key) => HELP_PAGES_BY_KEY[String(key || '')] || '';
export function helpDocLink(h, page) {
const _o1 = helpUrl(page);
if (!_o1) return null;
return h('p', { class: 'help-doc' }, h('a', { href: _o1, target: '_blank', rel: 'noopener', 'data-testid': 'help-doc-link', 'data-page': page }, HELP_LABEL));
}

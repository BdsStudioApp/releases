import config from '../config.js';
function _o3() {
const _o0 = (typeof window !== 'undefined' && window.BDSEdition) || (typeof globalThis !== 'undefined' && globalThis.BDSEdition) || null;
if (_o0 && typeof _o0.resolveEdition === 'function') return _o0.resolveEdition(config);
const _o2 = Object.assign({}, config.INSTANCE || {});
return { edition: config.edition || 'owner', flags: { id: config.edition || 'owner' }, instance: _o2 };
}
const R = _o3();
export const edition = R.edition;
export const flags = R.flags;
export const INSTANCE = R.instance;
export function publicUrl() {
const _o5 = INSTANCE.PUBLIC_URL || INSTANCE.APP_URL || '';
if (_o5) return _o5.replace(/\/*$/, '/');
if (typeof location !== 'undefined' && !/^http:\/\/(127\.0\.0\.1|localhost)/.test(location.origin)) return location.origin + location.pathname.replace(/[^/]*$/, '');
return '';
}
export function releaseOrigin() {
const _o5 = INSTANCE.RELEASE_ORIGIN || publicUrl() || '';
return _o5 ? _o5.replace(/\/*$/, '/') : '';
}
export function landingUrl() { return INSTANCE.LANDING_URL || ''; }
export const CHANNEL = INSTANCE.CHANNEL || '';
export const SUPPORT_EMAIL_DEFAULT = 'hotro@bdsstudio.app';
export function supportContact(cfg = config) {
const _o4 = (cfg && (cfg.SUPPORT || cfg.support)) || {};
const _o1 = (cfg && cfg.edition) || 'owner';
const email = String(_o4.email || _o4.SUPPORT_EMAIL || '').trim() || (_o1 === 'owner' ? '' : SUPPORT_EMAIL_DEFAULT);
const zalo = String(_o4.zalo || _o4.SUPPORT_ZALO || '').trim();
const text = [email && 'email ' + email, zalo && 'Zalo ' + zalo].filter(Boolean).join(' · ');
return { email, zalo, text };
}
export const PRIVACY_URL_DEFAULT = 'https://bdsstudio.app/chinh-sach-rieng-tu';
export function privacyUrl(cfg = config) {
const _o6 = String((cfg && cfg.PRIVACY_URL) || '').trim();
if (/^https:\/\/[^\s"'<>@]+$/.test(_o6)) return _o6;
return ((cfg && cfg.edition) || 'owner') === 'owner' ? '' : PRIVACY_URL_DEFAULT;
}
export function privacyLine(h, { testid = 'privacy-link', lead = '', cfg = config } = {}) {
const href = privacyUrl(cfg);
if (!href || typeof h !== 'function') return null;
return h('p', { class: 'muted small privacy-line', 'data-testid': testid }, lead,
h('a', { href, target: '_blank', rel: 'noopener', 'data-testid': testid + '-a' }, 'Chính sách quyền riêng tư'));
}
export default { edition, flags, INSTANCE, publicUrl, releaseOrigin, landingUrl, CHANNEL, supportContact, SUPPORT_EMAIL_DEFAULT, privacyUrl, privacyLine, PRIVACY_URL_DEFAULT };

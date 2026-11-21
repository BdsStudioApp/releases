import { supportContact, edition as EDITION } from './instance.1eceeeedc8.js';
import { scrubSecrets } from './health_logic.a1be44bf9a.js';
export function isSaleEdition(cfg) { return ((cfg && cfg.edition) || EDITION || 'owner') !== 'owner'; }
export function contactFor(cfg) { return supportContact(cfg || undefined); }
export function zaloLink(zalo) {
const d = String(zalo || '').replace(/[^\d+]/g, '').replace(/^\+?84/, '0');
return /^0\d{8,10}$/.test(d) ? 'https://zalo.me/' + d : '';
}
export const MAILTO_MAX = 1900;
export function mailtoLink(email, subject, body, max = MAILTO_MAX) {
const _o9 = String(email || '').trim();
if (!/^[^\s@?&]+@[^\s@?&]+\.[^\s@?&]+$/.test(_o9)) return '';
const _o2 = (s) => encodeURIComponent(String(s || ''));
const _o3 = 'mailto:' + _o9 + '?subject=' + _o2(subject) + '&body=';
let _o0 = String(body || '').replace(/\r?\n/g, '\r\n');
if ((_o3 + _o2(_o0)).length > max) {
const _o8 = '\r\n…(đã cắt bớt)';
let _o6 = 0, hi = _o0.length;
while (_o6 < hi) { const _o7 = Math.ceil((_o6 + hi) / 2); if ((_o3 + _o2(_o0.slice(0, _o7) + _o8)).length <= max) _o6 = _o7; else hi = _o7 - 1; }
_o0 = _o0.slice(0, _o6) + _o8;
}
return _o3 + _o2(_o0);
}
export function supportDiagnosticText({ versions = {}, screen = '', device = '', errors = [] } = {}) {
const _oa = versions || {};
const ver = [['Web', _oa.web], ['Máy chủ', _oa.server], ['Máy dựng', _oa.engine]].filter((x) => x[1]).map((x) => x[0] + ' v' + String(x[1]).replace(/^v/, '')).join(' · ');
const errs = (Array.isArray(errors) ? errors : []).slice(0, 5).map((e) => '- ' + [e.at ? new Date(Number(e.at)).toISOString().slice(0, 16).replace('T', ' ') : '', e.where || '', String(e.message || '').slice(0, 160)].filter(Boolean).join(' · '));
const _o5 = ['— Thông tin kỹ thuật (app tự kèm, không có dữ liệu khách, không có khoá/mật khẩu) —',
ver ? 'Phiên bản: ' + ver : '', _oa.edition ? 'Bản: ' + _oa.edition : '', screen ? 'Màn: ' + screen : '', device ? 'Thiết bị: ' + device : '',
errs.length ? 'Lỗi gần đây trên máy:' : '', ...errs].filter(Boolean);
return scrubSecrets(_o5.join('\n'), 1600);
}
export function sellerMail({ kind = '', kindLabel = '', text = '', diag = '', id = '' } = {}) {
const subject = 'BDS Studio – ' + (kind === 'bug' ? 'Báo lỗi' : 'Góp ý') + (kindLabel && kind !== 'bug' ? ' (' + kindLabel + ')' : '') + (id ? ' #' + id : '');
const body = [String(text || '').trim(), '', diag].join('\n').trim();
return { subject, body: scrubSecrets(body, 4000) };
}
export function supportBlock(h, { cfg, lead = 'Cần giúp? Liên hệ hỗ trợ:', testid = 'support-contact' } = {}) {
const _o1 = contactFor(cfg);
if (!_o1.text) return null;
const _o4 = [];
if (_o1.email) _o4.push(h('a', { href: 'mailto:' + _o1.email + '?subject=' + encodeURIComponent('BDS Studio – cần hỗ trợ'), 'data-testid': testid + '-email' }, _o1.email));
const _ob = zaloLink(_o1.zalo);
if (_o1.zalo) _o4.push(_ob ? h('a', { href: _ob, target: '_blank', rel: 'noopener', 'data-testid': testid + '-zalo' }, 'Zalo ' + _o1.zalo) : h('span', null, 'Zalo ' + _o1.zalo));
const parts = [];
_o4.forEach((x, i) => { if (i) parts.push(' · '); parts.push(x); });
return h('p', { class: 'small support-contact', 'data-testid': testid }, lead + ' ', ...parts);
}
export default { isSaleEdition, contactFor, zaloLink, mailtoLink, supportDiagnosticText, sellerMail, supportBlock, MAILTO_MAX };

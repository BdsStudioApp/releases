import { strip, parseData } from '../_lib/crm.js';
export const PARAMS = ['ref', 'v', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'g'];
const _o0 = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
export function makeCode(prefix = '', len = 5, rnd = Math.random) {
let s = '';
for (let _o5 = 0; _o5 < len; _o5++) s += _o0[Math.floor(rnd() * _o0.length) % _o0.length];
const _o7 = codePart(prefix).slice(0, 6);
return _o7 ? _o7 + '-' + s : s;
}
export function codePart(name) {
const _od = strip(name).toUpperCase().replace(/[^A-Z0-9 ]/g, ' ').split(/\s+/).filter(Boolean);
if (!_od.length) return '';
if (_od.length === 1) return _od[0].slice(0, 6);
return (_od.slice(0, -1).map(x => x[0]).join('') + _od[_od.length - 1]).slice(0, 6);
}
export function cleanCode(c) { return String(c || '').toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 24); }
export function taggedLink(base, params = {}) {
let _ob;
try { _ob = new URL(String(base || '').trim()); } catch { return ''; }
if (!/^https?:$/.test(_ob.protocol)) return '';
for (const [k, v] of Object.entries(params)) {
if (v === undefined || v === null || v === '') continue;
_ob.searchParams.set(k, String(v));
}
return _ob.toString();
}
export function slugPart(s) { return strip(s).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60); }
export function groupLink(base, { group, campaign } = {}) {
return taggedLink(base, { utm_source: 'group', utm_medium: 'community', utm_campaign: slugPart(campaign) || undefined, utm_content: group });
}
export function referralLink(base, code) { return taggedLink(base, { ref: cleanCode(code), utm_source: 'referral', utm_medium: 'referral' }); }
export function adLink(base, { platform, campaign, content, video } = {}) {
return taggedLink(base, { utm_source: platform, utm_medium: 'paid', utm_campaign: slugPart(campaign) || undefined, utm_content: slugPart(content) || undefined, v: video });
}
function _oa(_oc, key) {
if (!_oc) return '';
try { return new URL(_oc).searchParams.get(key) || ''; } catch { }
const _o6 = String(_oc).match(new RegExp('[?&#]' + key + '=([^&#]*)'));
if (!_o6) return '';
try { return decodeURIComponent(_o6[1].replace(/\+/g, ' ')); } catch { return _o6[1]; }
}
function _o8(_oc) {
if (!_oc) return '';
try { const _ob = new URL(_oc); return (_ob.hostname + _ob.pathname).replace(/\/+$/, ''); } catch { return ''; }
}
export function readAttribution(c) {
const _o3 = parseData(c && c.data);
const _o4 = _o3.g3 && typeof _o3.g3 === 'object' ? _o3.g3 : {};
const _oc = _o3.landing_url || _o4.page_url || '';
const _o9 = k => String(_o4[k] || _o3[k] || _oa(_oc, k) || '').trim();
const _o2 = {
ref: cleanCode(_o9('ref')),
v: _o9('v') || String(_o3.ma_video || ''),
utm_source: _o9('utm_source').toLowerCase(),
utm_medium: _o9('utm_medium').toLowerCase(),
utm_campaign: _o9('utm_campaign'),
utm_content: _o9('utm_content'),
page: _o8(_oc),
g3_kind: String(_o4.kind || ''),
g3_ref_id: String(_o4.ref_id || ''),
platform: String(_o4.platform || ''),
source: String((c && c.source) || ''),
};
_o2.channel = channelOf(_o2);
return _o2;
}
export const CHANNELS = {
facebook: 'Facebook / Instagram', tiktok: 'TikTok', google: 'Google / YouTube', zalo: 'Zalo', group: 'Nhóm cộng đồng',
referral: 'Giới thiệu', event: 'Sự kiện / livestream', doc: 'Tài liệu đổi số', comment: 'Bình luận / tin nhắn',
seo: 'Google tự nhiên (SEO)', landing: 'Landing (chưa rõ nguồn)', manual: 'Nhập tay', other: 'Khác',
};
const _o1 = [
[/^(fb|facebook|meta|ig|instagram|messenger)/, 'facebook'], [/^(tiktok|tt)/, 'tiktok'], [/^(google|gads|adwords|youtube|yt)/, 'google'],
[/^zalo/, 'zalo'], [/^(group|nhom|community)/, 'group'], [/^(referral|ref|gioithieu)/, 'referral'],
];
export function channelOf(_o2) {
if (_o2.ref) return 'referral';
const s = strip(_o2.utm_source).replace(/\s/g, '');
for (const [re, ch] of _o1) if (re.test(s)) return ch;
if (s === 'organic' || s === 'seo') return 'seo';
if (_o2.g3_kind === 'event') return 'event';
if (_o2.g3_kind === 'doc') return 'doc';
if (_o2.g3_kind === 'comment') return _o2.platform && CHANNELS[_o2.platform] ? _o2.platform : 'comment';
if (s) return 'other';
if (_o2.source === 'landing') return 'landing';
return _o2.source === 'manual' || !_o2.source ? 'manual' : 'other';
}
export function channelName(ch) { return CHANNELS[ch] || ch || 'Khác'; }
export function normChannel(x) {
const s = strip(x).replace(/\s/g, '');
for (const [re, ch] of _o1) if (re.test(s)) return ch;
if (CHANNELS[s]) return s;
return s ? 'other' : '';
}

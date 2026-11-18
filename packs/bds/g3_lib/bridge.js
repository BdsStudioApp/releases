import * as LB from '../_lib/landing.js';
import * as S from '../_lib/sales.js';
import { jsonLdScripts, projectLd, breadcrumbLd, faqLd, agentLd, projectSeo, joinUrl } from './seo.js';
export const PREFIX = { event: 'g3ev_', doc: 'g3doc_', seo: 'g3seo_' };
export const available = () => typeof LB.renderPage === 'function' && typeof LB.newLanding === 'function';
export function landingPages(ctx) {
const all = ctx.settings && typeof ctx.settings.all === 'function' ? ctx.settings.all() : {};
return Object.keys(all).filter(k => k.startsWith(LB.KEY_PREFIX)).map(k => LB.normalizeLanding(all[k])).filter(c => c && c.id)
.sort((a, _o1) => (_o1.updated_at || 0) - (a.updated_at || 0));
}
export function landingById(ctx, id) { return landingPages(ctx).find(c => c.id === id) || null; }
export async function saveLanding(ctx, cfg) {
if (!ctx.settings || typeof ctx.settings.set !== 'function') throw new Error('Không lưu được cài đặt');
cfg.updated_at = Date.now();
await ctx.settings.set(LB.KEY_PREFIX + cfg.id, cfg);
return cfg;
}
export async function env(ctx) { return S.loadEnv(ctx); }
export async function profile(ctx) { return S.getProfile(ctx); }
export function dataFor(E, cfg) {
const _o6 = E.project(cfg.project_id);
const { plans, policy } = E.plansFor(_o6);
return { project: _o6, plans, policy, projects: (cfg.projects || []).map(id => E.project(id)).filter(Boolean), cfg: E.cfg, today: E.today };
}
export function renderHtml(E, cfg, { server = '' } = {}) { return LB.renderPage(cfg, dataFor(E, cfg), { target: 'static', server }).html; }
function ymd(ms) { const _o3 = new Date(ms + 7 * 3600e3); return _o3.toISOString().slice(0, 10); }
function hm(ms) { const _o3 = new Date(ms + 7 * 3600e3); return _o3.toISOString().slice(11, 16); }
export function eventLanding(ev, { project = null, prof = {}, existing = null } = {}) {
const cfg = existing ? { ...existing, s: { ...existing.s } } : LB.newLanding({ id: PREFIX.event + ev.id, template: 'event', project, profile: prof });
const _o7 = ev.mode === 'online' ? 'Trực tuyến (livestream) – link xem gửi qua Zalo trước giờ phát' : [ev.place, ev.address].filter(Boolean).join(', ');
cfg.name = String(ev.title || cfg.name).slice(0, 80);
cfg.s.hero = { ...cfg.s.hero, heading: ev.title || cfg.s.hero.heading, sub: ev.description ? String(ev.description).slice(0, 200) : cfg.s.hero.sub, cta: 'Đăng ký tham dự' };
cfg.s.event = { ...cfg.s.event, date: ev.start_at ? ymd(ev.start_at) : '', time: ev.start_at ? hm(ev.start_at) : '', place: _o7 || cfg.s.event.place };
cfg.s.form = { ...cfg.s.form, heading: 'Đăng ký tham dự', button: 'Đăng ký' };
cfg.samples = (cfg.samples || []).filter(s => s !== 'event');
cfg.seo = { ...cfg.seo, title: String(ev.title || cfg.seo.title).slice(0, 70), description: String(ev.description || cfg.seo.description || '').slice(0, 160) };
return cfg;
}
export function docLanding(doc, { project = null, prof = {}, existing = null } = {}) {
const cfg = existing ? { ...existing, s: { ...existing.s }, on: { ...existing.on } } : LB.newLanding({ id: PREFIX.doc + doc.id, template: 'project', project, profile: prof });
cfg.name = ('Tài liệu: ' + doc.title).slice(0, 80);
cfg.on.doc = true;
cfg.s.doc = { ...cfg.s.doc, title: doc.title, desc: doc.description || cfg.s.doc.desc, button: 'Nhận tài liệu qua Zalo', url: doc.file_url || '' };
cfg.samples = (cfg.samples || []).filter(s => s !== 'doc');
return cfg;
}
export function applySeo(cfg, _o5) {
return { ...cfg, seo: { ...cfg.seo, title: _o5.title || cfg.seo.title, description: _o5.description || cfg.seo.description, base_url: _o5.canonical || cfg.seo.base_url } };
}
export function seoLanding(_o5, { project = null, prof = {}, existing = null } = {}) {
const cfg = existing || LB.newLanding({ id: PREFIX.seo + (project ? project.id : _o5.slug), template: 'project', project, profile: prof });
if (!existing) cfg.slug = _o5.slug || cfg.slug;
return applySeo(cfg, _o5);
}
export function ldFor(cfg, data = {}) {
if (cfg.template !== 'project' && cfg.template !== 'resale') return [];
const _o6 = data.project || {};
const _o2 = LB.normBaseUrl ? LB.normBaseUrl(cfg.seo.base_url) : cfg.seo.base_url;
const _o5 = { ...projectSeo(_o6), name: _o6.name || cfg.s.hero.heading, description: cfg.seo.description, canonical: _o2 || '', image: '' };
const _o0 = { name: cfg.contact.name, phone: cfg.contact.phone };
return [projectLd(_o5, _o0), _o2 ? breadcrumbLd([{ name: 'Trang chủ', url: joinUrl(_o2.replace(/\/[^/]*\/?$/, '/'), '') }, { name: _o5.name, url: _o2 }]) : null, faqLd(_o5.faq),
_o0.name ? agentLd({ name: _o0.name, phone: _o0.phone, license: cfg.contact.cert }) : null].filter(Boolean);
}
export function injectSeo(html, cfg, data = {}) {
const _o4 = jsonLdScripts(ldFor(cfg, data));
if (!_o4) return html;
return String(html).replace(/<\/head>/i, _o4 + '\n</head>');
}
export function pageUrl(cfg, server = '') {
const _o1 = LB.normBaseUrl ? LB.normBaseUrl(cfg.seo && cfg.seo.base_url) : (cfg.seo && cfg.seo.base_url) || '';
if (_o1) return _o1;
if (cfg.published && (cfg.published.gas || cfg.published.at) && LB.gasPageUrl && server) return LB.gasPageUrl(server, cfg.slug);
return '';
}
export function landingIdOf(data) {
if (!data || typeof data !== 'object') return '';
return String(data.landing_id || (data.landing && data.landing.id) || '');
}

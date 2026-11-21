import { newLanding, TEMPLATE_IDS } from './landing.js';
import { GOAL_TPLS } from './landing_goals.js';
import { normalizePlans } from './sales.js';
export const THUMB_DIR = 'assets/landing_thumbs/';
export const thumbSrc = (id) => THUMB_DIR + id + '.webp';
export const SAMPLE_PROJECT = Object.freeze({
id: 'mau_song_xanh', name: 'Mẫu Sông Xanh', dev: 'Công ty Ví Dụ', area: 'Khu Ví Dụ', loc: 'Đường Ví Dụ · Quận Mẫu, Thành phố Mẫu',
status: 'sale', handover: '2028-06', price: [62, 78], hue: [190, 210],
amenities: 'Công viên ven sông, Hồ bơi, Trường mầm non, Phòng gym, Siêu thị, Sân chơi trẻ em',
types: [{ n: 'Studio', a: [30, 35] }, { n: '1N', a: [45, 50] }, { n: '2N', a: [62, 70] }, { n: '3N', a: [85, 95] }, { n: 'Duplex', ask: true }]
});
export const SAMPLE_PROJECT_2 = Object.freeze({
id: 'mau_doi_thong', name: 'Khu đô thị Mẫu Đồi Thông', dev: 'Công ty Ví Dụ', loc: 'Quận Ví Dụ, Thành phố Mẫu', status: 'sale', price: [48, 60], hue: [100, 140],
types: [{ n: '1N', a: [42, 48] }, { n: '2N', a: [58, 66] }]
});
export const SAMPLE_PROFILE = Object.freeze({ name: 'Chuyên viên Mẫu', title: 'Chuyên viên tư vấn', phone: '0900000000', company: 'Công ty Mẫu' });
export const SAMPLE_PLANS = normalizePlans([
{ id: 'td', name: 'Theo tiến độ', sub: 'Chiết khấu ~5%', factor: 0.95, loan: 0, steps: [{ name: 'Đặt cọc & đợt 1', pct: 20, when: 'Khi ký thoả thuận', mo: 0 }, { name: 'Các đợt xây dựng', pct: 50, when: 'Theo tiến độ', mo: 6 }, { name: 'Bàn giao', pct: 30, when: 'Khi nhận nhà', mo: 'H' }] },
{ id: 'vay', name: 'Vay ngân hàng', sub: 'Hỗ trợ lãi suất 0% 12 tháng', factor: 1, loan: 0.7, steps: [{ name: 'Đặt cọc & đợt 1', pct: 15, when: 'Khi ký thoả thuận', mo: 0 }, { name: 'Ngân hàng giải ngân', pct: 70, when: 'Ký HĐMB', mo: 3 }, { name: 'Bàn giao', pct: 15, when: 'Khi nhận nhà', mo: 'H' }] }
]).plans;
export const SAMPLE_CFG = { LOAN_YEARS: 25, RATE: 10, TODAY: '2026-11' };
const _o0 = [
{ loai: 'ban', du_an: SAMPLE_PROJECT.name, ma: 'A1-08xx', toa: '', tang: '8', pn: '2N', dt: '66', huong: 'Đông Nam', gia: '3,9 tỷ', noi_that: '', ghi_chu: '', g: 3.9e9, src: 'kho' },
{ loai: 'ban', du_an: SAMPLE_PROJECT.name, ma: 'B2-15xx', toa: '', tang: '15', pn: '3N', dt: '90', huong: 'Tây Bắc', gia: '5,6 tỷ', noi_that: '', ghi_chu: '', g: 5.6e9, src: 'kho' },
{ loai: 'thue', du_an: SAMPLE_PROJECT.name, ma: 'A3-11xx', toa: '', tang: '11', pn: '1N', dt: '48', huong: 'Nam', gia: '12 triệu/tháng', noi_that: '', ghi_chu: '', g: 12e6, src: 'kho' }
];
export function sampleGoals(tpl) {
for (const g of Object.keys(GOAL_TPLS)) if (GOAL_TPLS[g].includes(tpl)) return [g];
return ['so_cap'];
}
export function sampleLanding(tpl) {
const id = TEMPLATE_IDS.includes(tpl) ? tpl : 'project';
const p = SAMPLE_PROJECT;
const cfg = newLanding({ id: 'mau_' + id, template: id, project: p, profile: SAMPLE_PROFILE, data: { plans: SAMPLE_PLANS, cfg: SAMPLE_CFG }, now: 0, goals: sampleGoals(id), infoOnly: false });
if (cfg.projects.length) cfg.projects = [p.id, SAMPLE_PROJECT_2.id];
const projects = cfg.projects.map((x) => (x === p.id ? p : SAMPLE_PROJECT_2));
return { cfg, data: { project: p, plans: SAMPLE_PLANS, policy: null, projects, cfg: SAMPLE_CFG, today: '2026-11-01', inventory: _o0 } };
}

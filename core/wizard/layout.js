export function actionBlocks(a, imgs = [], { portal = false } = {}) {
const _o1 = [{ kind: 'text', text: String((a && a.text) || '') }];
if (a.why) _o1.push({ kind: 'why', text: String(a.why) });
if (a.link) _o1.push({ kind: 'link', key: a.link });
if (a.installer) _o1.push({ kind: 'installer', key: a.installer });
if (a.widget) _o1.push({ kind: 'widget' });
const list = a.imgPortal && !portal ? [] : (Array.isArray(imgs) ? imgs : []);
list.forEach((x, k) => {
if (list.length > 1) _o1.push({ kind: 'caption', text: String((x && (x.caption || x.alt)) || ''), img: k });
_o1.push({ kind: 'img', img: k, ...(x || {}) });
});
if (Array.isArray(a.sub) && a.sub.length) _o1.push({ kind: 'sub', items: a.sub });
return _o1;
}
export function captionFirst(blocks) {
const imgs = blocks.filter((b) => b.kind === 'img');
if (!imgs.length) return true;
const _o3 = blocks.findIndex((b) => b.kind === 'text' && b.text.trim());
for (let _o0 = 0; _o0 < blocks.length; _o0++) {
if (blocks[_o0].kind !== 'img') continue;
if (_o3 < 0 || _o3 > _o0) return false;
if (imgs.length > 1) { const _o2 = blocks[_o0 - 1]; if (!_o2 || _o2.kind !== 'caption' || !_o2.text.trim()) return false; }
}
return true;
}
export default { actionBlocks, captionFirst };

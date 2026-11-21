(function () {
'use strict';
window.addEventListener('message', function (e) {
if (e.source !== window.parent) return;
var _o0 = e.data;
if (!_o0 || _o0.t !== 'lp-mau-css' || typeof _o0.css !== 'string') return;
try { var _o1 = new CSSStyleSheet(); _o1.replaceSync(_o0.css); document.adoptedStyleSheets = [_o1]; } catch (_) { }
document.documentElement.setAttribute('data-ready', '1');
});
document.addEventListener('submit', function (e) { e.preventDefault(); }, true);
})();

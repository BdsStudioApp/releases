import { crc32 } from './ooxml.js';
export { crc32 };
const _o1 = new TextEncoder();
const DOS_DATE = ((2026 - 1980) << 9) | (1 << 5) | 1;
export function zipStored(entries) {
const parts = [], central = [];
let off = 0;
for (const e of entries) {
const name = _o1.encode(e.name);
const data = typeof e.data === 'string' ? _o1.encode(e.data) : e.data;
const crc = crc32(data), flags = /[^\x20-\x7e]/.test(e.name) ? 0x0800 : 0;
const _oe = new Uint8Array(30 + name.length), l = new DataView(_oe.buffer);
l.setUint32(0, 0x04034b50, true); l.setUint16(4, 20, true); l.setUint16(6, flags, true); l.setUint16(8, 0, true);
l.setUint16(10, 0, true); l.setUint16(12, DOS_DATE, true); l.setUint32(14, crc, true);
l.setUint32(18, data.length, true); l.setUint32(22, data.length, true); l.setUint16(26, name.length, true); l.setUint16(28, 0, true);
_oe.set(name, 30);
const _o8 = new Uint8Array(46 + name.length), c = new DataView(_o8.buffer);
c.setUint32(0, 0x02014b50, true); c.setUint16(4, 20, true); c.setUint16(6, 20, true); c.setUint16(8, flags, true);
c.setUint16(10, 0, true); c.setUint16(12, 0, true); c.setUint16(14, DOS_DATE, true); c.setUint32(16, crc, true);
c.setUint32(20, data.length, true); c.setUint32(24, data.length, true); c.setUint16(28, name.length, true);
c.setUint32(42, off, true);
_o8.set(name, 46);
parts.push(_oe, data); central.push(_o8);
off += _oe.length + data.length;
}
const cdSize = central.reduce((_of, _oq) => _of + _oq.length, 0);
const _ob = new Uint8Array(22), d = new DataView(_ob.buffer);
d.setUint32(0, 0x06054b50, true); d.setUint16(8, entries.length, true); d.setUint16(10, entries.length, true);
d.setUint32(12, cdSize, true); d.setUint32(16, off, true);
const _oh = new Uint8Array(off + cdSize + 22);
let _oi = 0;
for (const _oq of [...parts, ...central, _ob]) { _oh.set(_oq, _oi); _oi += _oq.length; }
return _oh;
}
const _o5 = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n';
const _o2 = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main';
const _o4 = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';
const _o3 = 'http://schemas.openxmlformats.org/package/2006/relationships';
const _o0 = 'application/vnd.openxmlformats-officedocument.spreadsheetml';
function esc(v) {
return String(v).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F￾￿]/g, '')
.replace(/_x(?=[0-9A-Fa-f]{4}_)/g, '_x005F_x')
.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
export function colName(i) { let _ol = ''; for (i += 1; i > 0; i = Math.floor((i - 1) / 26)) _ol = String.fromCharCode(65 + ((i - 1) % 26)) + _ol; return _ol; }
const _om = (_ol, i) => (String(_ol || '').replace(/[[\]:*?/\\]/g, ' ').trim().slice(0, 31) || 'Sheet' + (i + 1));
const S_HEAD = 1, S_TEXT = 2;
const STYLES = _o5 + `<styleSheet xmlns="${_o2}">`
+ '<fonts count="2"><font><sz val="11"/><name val="Calibri"/><family val="2"/></font><font><b/><sz val="11"/><name val="Calibri"/><family val="2"/></font></fonts>'
+ '<fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill>'
+ '<fill><patternFill patternType="solid"><fgColor rgb="FFDDEBF7"/><bgColor indexed="64"/></patternFill></fill></fills>'
+ '<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>'
+ '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>'
+ '<cellXfs count="3"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>'
+ '<xf numFmtId="49" fontId="1" fillId="2" borderId="0" xfId="0" applyNumberFormat="1" applyFont="1" applyFill="1"/>'
+ '<xf numFmtId="49" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/></cellXfs>'
+ '<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>'
+ '</styleSheet>';
function _o7(ref, v, _ol) {
const _oo = _ol ? ` s="${_ol}"` : '';
if (v == null || v === '') return _ol ? `<c r="${ref}"${_oo}/>` : '';
if (typeof v === 'number' && Number.isFinite(v)) return `<c r="${ref}"${_oo}><v>${v}</v></c>`;
return `<c r="${ref}"${_oo} t="inlineStr"><is><t xml:space="preserve">${esc(v)}</t></is></c>`;
}
function _on(sh, first) {
const rows = sh.rows || [], cols = sh.cols || [];
const _op = cols.map((c, i) => (c && c.text ? i : -1)).filter(i => i >= 0);
const _og = Math.max(cols.length, ...rows.map(r => (r || []).length), 1);
const _od = Math.max(rows.length, sh.padTo || 0, 1);
const _oh = [];
rows.forEach((r, _ok) => {
const _oc = sh.header && _ok === 0, cells = [];
for (let _o9 = 0; _o9 < Math.max((r || []).length, _op.length ? _op[_op.length - 1] + 1 : 0); _o9++) {
const _ol = _oc ? S_HEAD : _op.includes(_o9) ? S_TEXT : 0;
cells.push(_o7(colName(_o9) + (_ok + 1), (r || [])[_o9], _ol));
}
const _o6 = cells.join('');
if (_o6) _oh.push(`<row r="${_ok + 1}">${_o6}</row>`);
});
for (let _ok = rows.length; _ok < (sh.padTo || 0) && _op.length; _ok++) {
_oh.push(`<row r="${_ok + 1}">` + _op.map(_o9 => `<c r="${colName(_o9)}${_ok + 1}" s="${S_TEXT}"/>`).join('') + '</row>');
}
const _oj = sh.header ? '<pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/><selection pane="bottomLeft" activeCell="A2" sqref="A2"/>' : '';
const _oa = cols.length ? '<cols>' + cols.map((c, i) => `<col min="${i + 1}" max="${i + 1}" width="${(c && c.width) || 12}" customWidth="1"${c && c.text ? ` style="${S_TEXT}"` : ''}/>`).join('') + '</cols>' : '';
const lists = (sh.lists || []).map(l => `<dataValidation type="list" allowBlank="1" showInputMessage="1" showErrorMessage="1" sqref="${l.ref}"><formula1>"${esc(l.values.join(','))}"</formula1></dataValidation>`);
return _o5 + `<worksheet xmlns="${_o2}" xmlns:r="${_o4}">`
+ `<dimension ref="A1:${colName(_og - 1)}${_od}"/>`
+ `<sheetViews><sheetView workbookViewId="0"${first ? ' tabSelected="1"' : ''}>${_oj}</sheetView></sheetViews>`
+ '<sheetFormatPr defaultRowHeight="15"/>' + _oa
+ (_oh.length ? `<sheetData>${_oh.join('')}</sheetData>` : '<sheetData/>')
+ (lists.length ? `<dataValidations count="${lists.length}">${lists.join('')}</dataValidations>` : '')
+ '<pageMargins left="0.7" right="0.7" top="0.75" bottom="0.75" header="0.3" footer="0.3"/></worksheet>';
}
export function xlsxBook(sheets) {
const list = (sheets && sheets.length ? sheets : [{ name: 'Sheet1', rows: [] }]);
const _of = list.length;
const files = [
{ name: '[Content_Types].xml', data: _o5 + '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
+ '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/>'
+ `<Override PartName="/xl/workbook.xml" ContentType="${_o0}.sheet.main+xml"/>`
+ list.map((_, i) => `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="${_o0}.worksheet+xml"/>`).join('')
+ `<Override PartName="/xl/styles.xml" ContentType="${_o0}.styles+xml"/></Types>` },
{ name: '_rels/.rels', data: _o5 + `<Relationships xmlns="${_o3}"><Relationship Id="rId1" Type="${_o4}/officeDocument" Target="xl/workbook.xml"/></Relationships>` },
{ name: 'xl/workbook.xml', data: _o5 + `<workbook xmlns="${_o2}" xmlns:r="${_o4}"><bookViews><workbookView activeTab="0"/></bookViews><sheets>`
+ list.map((_ol, i) => `<sheet name="${esc(_om(_ol.name, i))}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`).join('') + '</sheets></workbook>' },
{ name: 'xl/_rels/workbook.xml.rels', data: _o5 + `<Relationships xmlns="${_o3}">`
+ list.map((_, i) => `<Relationship Id="rId${i + 1}" Type="${_o4}/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`).join('')
+ `<Relationship Id="rId${_of + 1}" Type="${_o4}/styles" Target="styles.xml"/></Relationships>` },
{ name: 'xl/styles.xml', data: STYLES },
...list.map((_ol, i) => ({ name: `xl/worksheets/sheet${i + 1}.xml`, data: _on(_ol, i === 0) })),
];
return zipStored(files);
}

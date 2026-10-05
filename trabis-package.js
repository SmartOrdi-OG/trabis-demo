/* Trabis — Steuerberater-Paket
 *
 * Builds the file set an accountant receives for a period:
 *   - PDF   : cover, monthly summary, income + expense registers, then every attached
 *             invoice (income first, then expenses), each page stamped with its Belegnr.
 *   - XLSX  : Zusammenfassung, Einnahmen, Ausgaben, Journal (import-friendly), Mitarbeiter.
 *   - CSV   : the Journal sheet (semicolon, comma decimals, UTF-8 BOM) for software imports.
 *
 * Pure with respect to the app: it only sees the data handed to build(), so the owner's
 * browser (today) and an accountant portal fed by the API (later) use the same code.
 *
 * build({
 *   company: {name, address, taxId},
 *   from: 'YYYY-MM', to: 'YYYY-MM',
 *   transactions: [{id,type:'income'|'expense',name,amount(gross),vatRate,date,category,party}],
 *   employees: [{name, month, hours, workDays, urlaub, krank, karenz, feiertag, entitled, rest}],
 *   getAttachment: function(tx) -> Promise<{bytes:Uint8Array, type:string}|null>,
 *   want: {pdf:true, xlsx:true, csv:true}
 * }) -> Promise<{pdf, xlsx, csv, base, missingAttachments, counts}>
 */
(function(global) {
  'use strict';

  var PDFLIB_URL = 'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js';

  // ── small helpers ──────────────────────────────────────────────────────────
  function pad(n, w) { n = String(n); while(n.length < (w || 2)) n = '0' + n; return n; }
  function r2(x) { return Math.round((x + (x < 0 ? -1e-9 : 1e-9)) * 100) / 100; }
  function deNum(n) { return r2(n).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
  function deDate(iso) { return iso.substring(8, 10) + '.' + iso.substring(5, 7) + '.' + iso.substring(0, 4); }
  function lat(s) { return String(s == null ? '' : s).replace(/[\u2013\u2014\u2212]/g, '-').replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"').replace(/\u2026/g, '...').replace(/[^\x20-\x7E\xA0-\xFF]/g, '?'); }
  function safeName(s) { return String(s || 'Firma').replace(/[^\w\-]+/g, '_').replace(/^_+|_+$/g, '').substring(0, 40) || 'Firma'; }
  var MONTHS_DE = ['Jänner','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];
  function monthLabel(key) { return MONTHS_DE[+key.substring(5, 7) - 1] + ' ' + key.substring(0, 4); }
  function monthRange(from, to) {
    var out = [], y = +from.substring(0, 4), m = +from.substring(5, 7), ey = +to.substring(0, 4), em = +to.substring(5, 7);
    while(y < ey || (y === ey && m <= em)) { out.push(y + '-' + pad(m)); m++; if(m > 12) { m = 1; y++; } }
    return out;
  }
  // Gross amount → net / VAT, rounded to cents (VAT = gross − net so the parts always add up).
  function split(tx) {
    var gross = r2(parseFloat(tx.amount) || 0), rate = parseFloat(tx.vatRate) || 0;
    var net = r2(gross / (1 + rate / 100));
    return {net: net, vat: r2(gross - net), gross: gross, rate: rate};
  }

  // ── selection, numbering, totals ───────────────────────────────────────────
  function prepare(opts) {
    var months = monthRange(opts.from, opts.to), inRange = {};
    months.forEach(function(m) { inRange[m] = true; });
    var rows = (opts.transactions || []).filter(function(t) {
      return t && t.date && inRange[t.date.substring(0, 7)] && (t.type === 'income' || t.type === 'expense');
    }).map(function(t) {
      var s = split(t);
      return {tx: t, type: t.type, date: t.date, name: t.name || '', category: t.category || '', party: t.party || '',
              net: s.net, vat: s.vat, gross: s.gross, rate: s.rate};
    }).sort(function(a, b) { return a.date < b.date ? -1 : a.date > b.date ? 1 : (a.tx.id || 0) - (b.tx.id || 0); });
    var ci = 0, ce = 0;
    rows.forEach(function(r) { r.no = (r.type === 'income' ? 'E-' : 'A-') + pad(r.type === 'income' ? ++ci : ++ce, 3); });
    var income = rows.filter(function(r) { return r.type === 'income'; });
    var expense = rows.filter(function(r) { return r.type === 'expense'; });
    var summary = months.map(function(m) {
      var o = {month: m, iN: 0, iV: 0, iG: 0, eN: 0, eV: 0, eG: 0};
      rows.forEach(function(r) {
        if(r.date.substring(0, 7) !== m) return;
        var k = r.type === 'income' ? 'i' : 'e';
        o[k + 'N'] += r.net; o[k + 'V'] += r.vat; o[k + 'G'] += r.gross;
      });
      ['iN','iV','iG','eN','eV','eG'].forEach(function(k) { o[k] = r2(o[k]); });
      o.saldoNet = r2(o.iN - o.eN); o.zahllast = r2(o.iV - o.eV); o.total = r2(o.saldoNet - o.zahllast);
      return o;
    });
    return {months: months, rows: rows, income: income, expense: expense, summary: summary};
  }

  // ── minimal XLSX writer (stored zip, inline strings) ───────────────────────
  var CRC_T = (function() { var t = [], c, n, k; for(n = 0; n < 256; n++) { c = n; for(k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
  function crc32(b) { var c = 0xFFFFFFFF; for(var i = 0; i < b.length; i++) c = CRC_T[(c ^ b[i]) & 255] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; }
  function utf8(s) { return new TextEncoder().encode(s); }
  function zipStore(files) {
    var parts = [], central = [], offset = 0, now = new Date();
    var dt = ((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate();
    var tm = (now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1);
    files.forEach(function(f) {
      var name = utf8(f.name), data = typeof f.data === 'string' ? utf8(f.data) : f.data, crc = crc32(data);
      var h = new DataView(new ArrayBuffer(30));
      h.setUint32(0, 0x04034b50, true); h.setUint16(4, 20, true); h.setUint16(6, 0x0800, true); h.setUint16(8, 0, true);
      h.setUint16(10, tm, true); h.setUint16(12, dt, true); h.setUint32(14, crc, true);
      h.setUint32(18, data.length, true); h.setUint32(22, data.length, true); h.setUint16(26, name.length, true); h.setUint16(28, 0, true);
      parts.push(new Uint8Array(h.buffer), name, data);
      var c = new DataView(new ArrayBuffer(46));
      c.setUint32(0, 0x02014b50, true); c.setUint16(4, 20, true); c.setUint16(6, 20, true); c.setUint16(8, 0x0800, true); c.setUint16(10, 0, true);
      c.setUint16(12, tm, true); c.setUint16(14, dt, true); c.setUint32(16, crc, true);
      c.setUint32(20, data.length, true); c.setUint32(24, data.length, true); c.setUint16(28, name.length, true);
      c.setUint32(42, offset, true);
      central.push(new Uint8Array(c.buffer), name);
      offset += 30 + name.length + data.length;
    });
    var csize = 0; central.forEach(function(p) { csize += p.length; });
    var e = new DataView(new ArrayBuffer(22));
    e.setUint32(0, 0x06054b50, true); e.setUint16(8, files.length, true); e.setUint16(10, files.length, true);
    e.setUint32(12, csize, true); e.setUint32(16, offset, true);
    var all = parts.concat(central, [new Uint8Array(e.buffer)]), total = 0;
    all.forEach(function(p) { total += p.length; });
    var out = new Uint8Array(total), pos = 0;
    all.forEach(function(p) { out.set(p, pos); pos += p.length; });
    return out;
  }
  function xmlEsc(s) { return String(s).replace(/[&<>"]/g, function(c) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, ''); }
  function colName(i) { var s = ''; i++; while(i > 0) { var m = (i - 1) % 26; s = String.fromCharCode(65 + m) + s; i = Math.floor((i - 1) / 26); } return s; }
  function serial(iso) { return Math.round((Date.UTC(+iso.substring(0, 4), +iso.substring(5, 7) - 1, +iso.substring(8, 10)) - Date.UTC(1899, 11, 30)) / 86400000); }
  // Cell kinds: string | {n, s} number with style | {f, v, s} formula | {d} date
  var ST = {money: 1, date: 2, head: 3, total: 4, bold: 5, int: 6, dec: 7};
  function sheetXml(sheet) {
    var rows = sheet.rows, x = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews><cols>';
    sheet.widths.forEach(function(w, i) { x += '<col min="' + (i + 1) + '" max="' + (i + 1) + '" width="' + w + '" customWidth="1"/>'; });
    x += '</cols><sheetData>';
    rows.forEach(function(row, ri) {
      x += '<row r="' + (ri + 1) + '">';
      row.forEach(function(c, ci) {
        if(c == null || c === '') return;
        var ref = colName(ci) + (ri + 1);
        if(typeof c === 'string') x += '<c r="' + ref + '" t="inlineStr"' + (ri === 0 && sheet.header !== false ? ' s="' + ST.head + '"' : '') + '><is><t xml:space="preserve">' + xmlEsc(c) + '</t></is></c>';
        else if(c.f != null) x += '<c r="' + ref + '" s="' + (c.s || ST.total) + '"><f>' + xmlEsc(c.f) + '</f><v>' + c.v + '</v></c>';
        else if(c.d) x += '<c r="' + ref + '" s="' + ST.date + '"><v>' + serial(c.d) + '</v></c>';
        else if(c.t != null) x += '<c r="' + ref + '" t="inlineStr" s="' + (c.s || ST.bold) + '"><is><t>' + xmlEsc(c.t) + '</t></is></c>';
        else x += '<c r="' + ref + '" s="' + (c.s || ST.money) + '"><v>' + c.n + '</v></c>';
      });
      x += '</row>';
    });
    x += '</sheetData>';
    if(sheet.filter && rows.length > 1) x += '<autoFilter ref="A1:' + colName(rows[0].length - 1) + rows.length + '"/>';
    return x + '</worksheet>';
  }
  var STYLES = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'
    + '<numFmts count="2"><numFmt numFmtId="164" formatCode="#,##0.00"/><numFmt numFmtId="165" formatCode="dd\\.mm\\.yyyy"/></numFmts>'
    + '<fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts>'
    + '<fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FFDCEBFA"/></patternFill></fill></fills>'
    + '<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>'
    + '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>'
    + '<cellXfs count="8"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>'
    + '<xf numFmtId="164" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/>'
    + '<xf numFmtId="165" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/>'
    + '<xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"/>'
    + '<xf numFmtId="164" fontId="1" fillId="0" borderId="0" xfId="0" applyNumberFormat="1" applyFont="1"/>'
    + '<xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/>'
    + '<xf numFmtId="1" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/>'
    + '<xf numFmtId="2" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/></cellXfs></styleSheet>';

  function sumRow(label, firstCol, lastCol, first, last, rows, cols, vals) {
    var row = []; row[0] = {t: label};
    cols.forEach(function(ci, k) { row[ci] = {f: 'SUM(' + colName(ci) + first + ':' + colName(ci) + last + ')', v: vals[k], s: ST.total}; });
    return row;
  }
  function buildSheets(P, opts) {
    var sheets = [];
    // Zusammenfassung
    var z = [['Monat', 'Einnahmen Netto', 'Einnahmen USt', 'Einnahmen Brutto', 'Ausgaben Netto', 'Vorsteuer (Ausgaben USt)', 'Ausgaben Brutto', 'Saldo Netto', 'USt-Zahllast (E − A)', 'Total (Netto − Zahllast)']];
    P.summary.forEach(function(s) {
      z.push([monthLabel(s.month), {n: s.iN}, {n: s.iV}, {n: s.iG}, {n: s.eN}, {n: s.eV}, {n: s.eG}, {n: s.saldoNet}, {n: s.zahllast}, {n: s.total}]);
    });
    var f = 2, l = z.length, sums = [0,0,0,0,0,0,0,0,0];
    P.summary.forEach(function(s) { [s.iN,s.iV,s.iG,s.eN,s.eV,s.eG,s.saldoNet,s.zahllast,s.total].forEach(function(v, i) { sums[i] += v; }); });
    z.push(sumRow('Summe', 1, 9, f, l, z, [1,2,3,4,5,6,7,8,9], sums.map(r2)));
    sheets.push({name: 'Zusammenfassung', rows: z, widths: [18, 16, 14, 16, 16, 20, 16, 14, 20, 22], filter: false});

    function register(list, title, partyHead) {
      var rows = [['Belegnr.', 'Datum', 'Buchungstext', 'Kategorie', partyHead, 'USt-Satz %', 'Netto', 'USt', 'Brutto', 'Beleg im PDF']];
      list.forEach(function(r) {
        rows.push([r.no, {d: r.date}, r.name, r.category, r.party, {n: r.rate, s: ST.int}, {n: r.net}, {n: r.vat}, {n: r.gross}, r.hasFile ? 'ja' : 'nein']);
      });
      var tot = [{t: 'Summe'}]; var n = rows.length;
      var tv = [0, 0, 0]; list.forEach(function(r) { tv[0] += r.net; tv[1] += r.vat; tv[2] += r.gross; });
      if(list.length) { [6, 7, 8].forEach(function(ci, k) { tot[ci] = {f: 'SUM(' + colName(ci) + '2:' + colName(ci) + n + ')', v: r2(tv[k]), s: ST.total}; }); rows.push(tot); }
      return {name: title, rows: rows, widths: [10, 12, 34, 16, 26, 11, 14, 14, 14, 13], filter: true};
    }
    sheets.push(register(P.income, 'Einnahmen', 'Kunde'));
    sheets.push(register(P.expense, 'Ausgaben', 'Lieferant / Gegenpartei'));

    // Journal: one signed list, easiest to import
    var j = [['Belegnr.', 'Datum', 'Art', 'Buchungstext', 'Kategorie', 'Gegenpartei', 'USt-Satz %', 'Netto', 'USt', 'Brutto']];
    P.rows.forEach(function(r) {
      var k = r.type === 'income' ? 1 : -1;
      j.push([r.no, {d: r.date}, r.type === 'income' ? 'Einnahme' : 'Ausgabe', r.name, r.category, r.party, {n: r.rate, s: ST.int}, {n: r2(k * r.net)}, {n: r2(k * r.vat)}, {n: r2(k * r.gross)}]);
    });
    sheets.push({name: 'Journal', rows: j, widths: [10, 12, 11, 34, 16, 26, 11, 14, 14, 14], filter: true});

    if(opts.employees && opts.employees.length) {
      var m = [['Mitarbeiter', 'Monat', 'Arbeitsstunden', 'Arbeitstage', 'Urlaub (Tage)', 'Krankenstand (Tage)', 'Karenz (Tage)', 'Feiertage', 'Urlaubsanspruch (kum.)', 'Resturlaub']];
      opts.employees.forEach(function(e) {
        m.push([e.name, monthLabel(e.month), {n: r2(e.hours), s: ST.dec}, {n: e.workDays, s: ST.int}, {n: e.urlaub, s: ST.int}, {n: e.krank, s: ST.int}, {n: e.karenz, s: ST.int}, {n: e.feiertag, s: ST.int}, {n: r2(e.entitled), s: ST.dec}, {n: r2(e.rest), s: ST.dec}]);
      });
      sheets.push({name: 'Mitarbeiter', rows: m, widths: [24, 18, 16, 12, 14, 18, 14, 12, 22, 12], filter: true});
    }
    return sheets;
  }
  function buildXlsx(sheets) {
    var ct = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>';
    var wb = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>';
    var rel = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">';
    var files = [];
    sheets.forEach(function(s, i) {
      ct += '<Override PartName="/xl/worksheets/sheet' + (i + 1) + '.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>';
      wb += '<sheet name="' + xmlEsc(s.name) + '" sheetId="' + (i + 1) + '" r:id="rId' + (i + 1) + '"/>';
      rel += '<Relationship Id="rId' + (i + 1) + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet' + (i + 1) + '.xml"/>';
      files.push({name: 'xl/worksheets/sheet' + (i + 1) + '.xml', data: sheetXml(s)});
    });
    ct += '</Types>'; wb += '</sheets></workbook>';
    rel += '<Relationship Id="rId' + (sheets.length + 1) + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>';
    files.unshift({name: '[Content_Types].xml', data: ct},
      {name: '_rels/.rels', data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>'},
      {name: 'xl/workbook.xml', data: wb}, {name: 'xl/_rels/workbook.xml.rels', data: rel}, {name: 'xl/styles.xml', data: STYLES});
    return zipStore(files);
  }

  function buildCsv(P) {
    function q(v) { v = String(v); return /[;"\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }
    function n(v) { return r2(v).toFixed(2).replace('.', ','); }
    var lines = [['Belegnr', 'Datum', 'Art', 'Buchungstext', 'Kategorie', 'Gegenpartei', 'USt-Satz', 'Netto', 'USt', 'Brutto'].join(';')];
    P.rows.forEach(function(r) {
      var k = r.type === 'income' ? 1 : -1;
      lines.push([r.no, deDate(r.date), r.type === 'income' ? 'Einnahme' : 'Ausgabe', q(r.name), q(r.category), q(r.party), r.rate, n(k * r.net), n(k * r.vat), n(k * r.gross)].join(';'));
    });
    return '﻿' + lines.join('\r\n') + '\r\n';
  }

  // ── PDF ────────────────────────────────────────────────────────────────────
  function ensurePdfLib() {
    if(global.PDFLib) return Promise.resolve(global.PDFLib);
    return new Promise(function(res, rej) {
      var s = document.createElement('script');
      s.src = PDFLIB_URL; s.onload = function() { global.PDFLib ? res(global.PDFLib) : rej(new Error('pdf-lib')); };
      s.onerror = function() { rej(new Error('pdf-lib load failed')); };
      document.head.appendChild(s);
    });
  }
  function jsPdfCtor() { return (global.jspdf && global.jspdf.jsPDF) ? global.jspdf.jsPDF : (global.jsPDF || null); }

  function frontMatter(P, opts) {
    var J = jsPdfCtor();
    if(!J) throw new Error('jsPDF missing');
    var doc = new J({unit: 'mm', format: 'a4'}), W = 210, M = 15, y;
    function head(title) {
      doc.setFillColor(26, 127, 212); doc.rect(0, 0, W, 5, 'F');
      doc.setFont('helvetica', 'bold'); doc.setFontSize(13); doc.setTextColor(20);
      doc.text(lat(title), M, 17);
      doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(120);
      doc.text(lat((opts.company.name || '') + ' · ' + monthLabel(opts.from) + (opts.from === opts.to ? '' : ' – ' + monthLabel(opts.to))), W - M, 17, {align: 'right'});
      y = 26;
    }
    // cover
    doc.setFillColor(26, 127, 212); doc.rect(0, 0, W, 8, 'F');
    doc.setFont('helvetica', 'bold'); doc.setFontSize(24); doc.setTextColor(20); doc.text('Unterlagen für den Steuerberater', M, 50);
    doc.setFontSize(14); doc.setTextColor(26, 127, 212); doc.text(lat(opts.company.name || ''), M, 62);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(11); doc.setTextColor(60);
    var info = [['Zeitraum', monthLabel(opts.from) + (opts.from === opts.to ? '' : ' bis ' + monthLabel(opts.to))],
      ['Adresse', opts.company.address || '—'], ['UID-Nummer', opts.company.taxId || '—'],
      ['Erstellt am', deDate(new Date().toISOString().substring(0, 10))],
      ['Einnahmen-Belege', String(P.income.length)], ['Ausgaben-Belege', String(P.expense.length)]];
    info.forEach(function(r, i) { doc.setTextColor(120); doc.text(lat(r[0]), M, 80 + i * 8); doc.setTextColor(20); doc.text(lat(r[1]), M + 42, 80 + i * 8); });
    doc.setFontSize(9); doc.setTextColor(120);
    doc.text('Inhalt: 1 Zusammenfassung · 2 Einnahmen (Verzeichnis + Belege) · 3 Ausgaben (Verzeichnis + Belege).', M, 140);
    doc.text('Alle Beträge in EUR. Belegnummern (E-… Einnahmen, A-… Ausgaben) stimmen mit der Excel-Datei überein.', M, 146);

    // summary
    doc.addPage(); head('1  Zusammenfassung');
    var cols = [['Monat', 15, 'l'], ['Einn. Netto', 52, 'r'], ['Einn. USt', 76, 'r'], ['Einn. Brutto', 102, 'r'], ['Ausg. Netto', 128, 'r'], ['Vorsteuer', 152, 'r'], ['Ausg. Brutto', 178, 'r']];
    function th(c) { doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(90); c.forEach(function(k) { doc.text(lat(k[0]), k[2] === 'r' ? k[1] + 8 : k[1], y, k[2] === 'r' ? {align: 'right'} : undefined); }); y += 2; doc.setDrawColor(200); doc.line(M, y, W - M, y); y += 5; }
    th(cols);
    var tot = {iN: 0, iV: 0, iG: 0, eN: 0, eV: 0, eG: 0};
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(20);
    P.summary.forEach(function(s) {
      var v = [monthLabel(s.month), deNum(s.iN), deNum(s.iV), deNum(s.iG), deNum(s.eN), deNum(s.eV), deNum(s.eG)];
      cols.forEach(function(k, i) { doc.text(lat(v[i]), k[2] === 'r' ? k[1] + 8 : k[1], y, k[2] === 'r' ? {align: 'right'} : undefined); });
      Object.keys(tot).forEach(function(k) { tot[k] += s[k]; });
      y += 6;
    });
    doc.line(M, y - 3, W - M, y - 3); doc.setFont('helvetica', 'bold');
    var tv = ['Summe', deNum(tot.iN), deNum(tot.iV), deNum(tot.iG), deNum(tot.eN), deNum(tot.eV), deNum(tot.eG)];
    cols.forEach(function(k, i) { doc.text(lat(tv[i]), k[2] === 'r' ? k[1] + 8 : k[1], y + 2, k[2] === 'r' ? {align: 'right'} : undefined); });
    y += 14;
    var sN = r2(tot.iN - tot.eN), zl = r2(tot.iV - tot.eV);
    doc.setFontSize(11);
    [['Saldo Netto (Einnahmen − Ausgaben)', sN], ['USt-Zahllast (Einnahmen-USt − Vorsteuer)', zl], ['Total (Saldo Netto − Zahllast)', r2(sN - zl)]].forEach(function(r) {
      doc.setFont('helvetica', 'normal'); doc.setTextColor(60); doc.text(lat(r[0]), M, y);
      doc.setFont('helvetica', 'bold'); doc.setTextColor(20); doc.text('EUR ' + deNum(r[1]), W - M, y, {align: 'right'}); y += 8;
    });

    // registers
    function register(list, title, partyHead) {
      doc.addPage(); head(title);
      var c = [['Nr.', 15, 'l'], ['Datum', 29, 'l'], ['Buchungstext', 51, 'l'], [partyHead, 105, 'l'], ['Netto', 150, 'r'], ['USt', 168, 'r'], ['Brutto', 186, 'r'], ['Beleg', 192, 'l']];
      function hdr() { doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(90); c.forEach(function(k) { doc.text(lat(k[0]), k[2] === 'r' ? k[1] : k[1], y, k[2] === 'r' ? {align: 'right'} : undefined); }); y += 2; doc.setDrawColor(200); doc.line(M, y, W - M, y); y += 5; }
      hdr();
      doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(20);
      var t = {n: 0, v: 0, g: 0};
      list.forEach(function(r) {
        if(y > 275) { doc.addPage(); head(title + ' (Fortsetzung)'); hdr(); doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(20); }
        var cells = [r.no, deDate(r.date), r.name.substring(0, 34), r.party.substring(0, 26), deNum(r.net), deNum(r.vat), deNum(r.gross)];
        c.slice(0, 7).forEach(function(k, i) { doc.text(lat(cells[i]), k[1], y, k[2] === 'r' ? {align: 'right'} : undefined); });
        doc.setTextColor(r.hasFile ? 22 : 150, r.hasFile ? 163 : 150, r.hasFile ? 74 : 150); doc.text(r.hasFile ? 'ja' : '–', 192, y); doc.setTextColor(20);
        t.n += r.net; t.v += r.vat; t.g += r.gross; y += 5.5;
      });
      if(!list.length) { doc.setTextColor(120); doc.text('Keine Belege im Zeitraum.', M, y); }
      else { doc.line(M, y - 3, W - M, y - 3); doc.setFont('helvetica', 'bold'); doc.text('Summe', M, y + 2);
        [[t.n, 150], [t.v, 168], [t.g, 186]].forEach(function(p) { doc.text(deNum(p[0]), p[1], y + 2, {align: 'right'}); }); }
    }
    register(P.income, '2  Einnahmen – Verzeichnis', 'Kunde');
    register(P.expense, '3  Ausgaben – Verzeichnis', 'Lieferant');
    return doc.output('arraybuffer');
  }

  function toPngBytes(bytes, type) {
    return new Promise(function(res, rej) {
      var url = URL.createObjectURL(new Blob([bytes], {type: type || 'image/png'})), img = new Image();
      img.onload = function() {
        var c = document.createElement('canvas'); c.width = img.naturalWidth || 800; c.height = img.naturalHeight || 1000;
        var x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); x.drawImage(img, 0, 0);
        c.toBlob(function(b) { URL.revokeObjectURL(url); b ? b.arrayBuffer().then(function(a) { res(new Uint8Array(a)); }) : rej(new Error('png')); }, 'image/png');
      };
      img.onerror = function() { URL.revokeObjectURL(url); rej(new Error('image')); };
      img.src = url;
    });
  }

  function buildPdf(P, opts) {
    var front = frontMatter(P, opts), missing = 0;
    return ensurePdfLib().then(function(L) {
      var PDFDocument = L.PDFDocument, StandardFonts = L.StandardFonts, rgb = L.rgb;
      return PDFDocument.load(front).then(function(out) {
        return Promise.all([out.embedFont(StandardFonts.Helvetica), out.embedFont(StandardFonts.HelveticaBold)]).then(function(fonts) {
          var font = fonts[0], bold = fonts[1];
          function stamp(page, r) {
            var sz = page.getSize();
            page.drawRectangle({x: 0, y: sz.height - 18, width: sz.width, height: 18, color: rgb(1, 1, 1), opacity: 0.9});
            page.drawText(lat(r.no + '  ·  ' + deDate(r.date) + '  ·  ' + r.name.substring(0, 40) + '  ·  EUR ' + deNum(r.gross)), {x: 8, y: sz.height - 12, size: 8, font: bold, color: rgb(0.1, 0.1, 0.1)});
          }
          function divider(title, sub) {
            var p = out.addPage([595.28, 841.89]);
            p.drawRectangle({x: 0, y: 835, width: 595, height: 7, color: rgb(0.1, 0.5, 0.83)});
            p.drawText(lat(title), {x: 50, y: 520, size: 30, font: bold, color: rgb(0.08, 0.08, 0.08)});
            p.drawText(lat(sub), {x: 50, y: 490, size: 12, font: font, color: rgb(0.4, 0.4, 0.4)});
          }
          function placeholder(r, why) {
            var p = out.addPage([595.28, 841.89]); stamp(p, r);
            p.drawText(lat(why), {x: 50, y: 700, size: 12, font: font, color: rgb(0.6, 0.1, 0.1)});
          }
          function addOne(r) {
            return Promise.resolve(opts.getAttachment ? opts.getAttachment(r.tx) : null).then(function(att) {
              if(!att || !att.bytes) { return; }
              r.hasFile = true;
              var type = (att.type || '').toLowerCase(), bytes = att.bytes;
              if(type.indexOf('pdf') >= 0) {
                return PDFDocument.load(bytes, {ignoreEncryption: true}).then(function(src) {
                  return out.copyPages(src, src.getPageIndices());
                }).then(function(pages) {
                  pages.forEach(function(pg, i) { out.addPage(pg); if(i === 0) stamp(pg, r); });
                });
              }
              var p0 = (type.indexOf('png') >= 0) ? Promise.resolve({b: bytes, png: true})
                     : (type.indexOf('jpeg') >= 0 || type.indexOf('jpg') >= 0) ? Promise.resolve({b: bytes, png: false})
                     : toPngBytes(bytes, type).then(function(b) { return {b: b, png: true}; });
              return p0.then(function(o) { return o.png ? out.embedPng(o.b) : out.embedJpg(o.b); }).then(function(img) {
                var page = out.addPage([595.28, 841.89]), maxW = 545, maxH = 780;
                var s = Math.min(maxW / img.width, maxH / img.height, 1.5);
                page.drawImage(img, {x: (595.28 - img.width * s) / 2, y: 841.89 - 24 - img.height * s, width: img.width * s, height: img.height * s});
                stamp(page, r);
              });
            }).catch(function() { missing++; r.hasFile = false; placeholder(r, 'Beleg konnte nicht gelesen werden: ' + r.no); });
          }
          function run(list, title, sub) {
            var withFile = [];
            var chain = Promise.resolve();
            var pending = [];
            list.forEach(function(r) { pending.push(r); });
            chain = chain.then(function() { divider(title, sub); });
            pending.forEach(function(r) { chain = chain.then(function() { return addOne(r); }); });
            return chain;
          }
          return run(P.income, 'Einnahmen – Belege', 'Ausgangsrechnungen, geordnet nach Datum (E-001 …)')
            .then(function() { return run(P.expense, 'Ausgaben – Belege', 'Eingangsrechnungen, geordnet nach Datum (A-001 …)'); })
            .then(function() {
              var pages = out.getPages();
              pages.forEach(function(pg, i) {
                var sz = pg.getSize();
                pg.drawText('Seite ' + (i + 1) + ' / ' + pages.length, {x: sz.width - 80, y: 10, size: 7, font: font, color: rgb(0.45, 0.45, 0.45)});
              });
              return out.save();
            });
        });
      });
    });
  }

  // ── public API ─────────────────────────────────────────────────────────────
  function build(opts) {
    opts.company = opts.company || {};
    var want = opts.want || {pdf: true, xlsx: true, csv: true};
    var P = prepare(opts), res = {counts: {income: P.income.length, expense: P.expense.length}, missingAttachments: 0};
    res.base = 'Trabis_Steuerberater_' + safeName(opts.company.name) + '_' + opts.from + (opts.from === opts.to ? '' : '_bis_' + opts.to);
    // Which rows have files — needed by the registers in every output.
    return Promise.all(P.rows.map(function(r) {
      return Promise.resolve(opts.getAttachment ? opts.getAttachment(r.tx) : null).then(function(a) { r.hasFile = !!(a && a.bytes); }, function() { r.hasFile = false; });
    })).then(function() {
      if(want.csv) res.csv = buildCsv(P);
      var p = want.pdf ? buildPdf(P, opts).then(function(b) { res.pdf = b; }, function(e) {
        // pdf-lib unavailable (offline): still deliver the registers, flag the missing attachments
        res.pdfError = String(e && e.message || e);
        res.pdf = new Uint8Array(frontMatter(P, opts));
      }) : Promise.resolve();
      return p;
    }).then(function() {
      if(want.xlsx) res.xlsx = buildXlsx(buildSheets(P, opts));
      P.rows.forEach(function(r) { if(!r.hasFile && r.tx) {} });
      return res;
    });
  }

  function download(bytes, name, mime) {
    var blob = bytes instanceof Blob ? bytes : new Blob([bytes], {type: mime}), url = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = url; a.download = name; document.body.appendChild(a); a.click();
    setTimeout(function() { URL.revokeObjectURL(url); a.remove(); }, 1500);
  }

  global.TrabisPackage = {build: build, download: download, prepare: prepare, monthRange: monthRange};
})(window);

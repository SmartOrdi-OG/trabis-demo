// ────────────────────────────────────────
// ── RECEIPTS: camera/upload + IndexedDB + local OCR (Tesseract.js) ──
// ────────────────────────────────────────
var RCPT_TXT = {
  label:    {en:'Receipt — photo or PDF (optional)', ar:'فاتورة المصروف — صورة أو PDF (اختياري)', de:'Beleg — Foto oder PDF (optional)'},
  camera:   {en:'Camera', ar:'كاميرا', de:'Kamera'},
  upload:   {en:'Upload', ar:'رفع ملف', de:'Hochladen'},
  reading:  {en:'Reading the receipt… amounts will be filled in automatically.', ar:'جاري قراءة الفاتورة… المبالغ هتتملأ تلقائيًا.', de:'Beleg wird gelesen… Beträge werden automatisch ausgefüllt.'},
  found:    {en:'Detected — please verify:', ar:'اتقرا تلقائيًا — راجع الأرقام:', de:'Erkannt — bitte prüfen:'},
  noRead:   {en:'Could not read the receipt automatically. It is attached — enter the amount manually.', ar:'معرفناش نقرا الفاتورة تلقائيًا. اترفقت بنجاح — اكتب المبلغ يدوي.', de:'Beleg konnte nicht automatisch gelesen werden. Er ist angehängt — Betrag bitte manuell eingeben.'},
  attached: {en:'PDF attached. Enter the amount manually.', ar:'الـ PDF اترفق. اكتب المبلغ يدوي.', de:'PDF angehängt. Betrag bitte manuell eingeben.'},
  view:     {en:'View receipt', ar:'عرض الفاتورة', de:'Beleg anzeigen'},
  rowLbl:   {en:'RECEIPT', ar:'فاتورة المصروف', de:'BELEG'}
};
function rtx(k) { var lang = state.lang; return (RCPT_TXT[k] && (RCPT_TXT[k][lang] || RCPT_TXT[k].en)) || k; }

function receiptDb() {
  return new Promise(function(resolve, reject) {
    if(window._receiptDbInst) { resolve(window._receiptDbInst); return; }
    var req = indexedDB.open('smartac_receipts', 1);
    req.onupgradeneeded = function(e) {
      var db = e.target.result;
      if(!db.objectStoreNames.contains('receipts')) db.createObjectStore('receipts', {keyPath:'id'});
    };
    req.onsuccess = function(e) { window._receiptDbInst = e.target.result; resolve(window._receiptDbInst); };
    req.onerror = function() { reject(req.error); };
  });
}
function receiptPut(rec) {
  return receiptDb().then(function(db) {
    return new Promise(function(res, rej) {
      var t = db.transaction('receipts', 'readwrite');
      t.objectStore('receipts').put(rec);
      t.oncomplete = res; t.onerror = function(){ rej(t.error); };
    });
  });
}
function receiptGet(id) {
  return receiptDb().then(function(db) {
    return new Promise(function(res, rej) {
      var r = db.transaction('receipts').objectStore('receipts').get(id);
      r.onsuccess = function(){ res(r.result); }; r.onerror = function(){ rej(r.error); };
    });
  });
}
function receiptDeleteRec(id) {
  return receiptDb().then(function(db) {
    return new Promise(function(res) {
      var t = db.transaction('receipts', 'readwrite');
      t.objectStore('receipts').delete(id);
      t.oncomplete = res; t.onerror = res;
    });
  }).catch(function(){});
}

// Downscale photos before storing (IndexedDB is generous but phone photos are 5-12MB)
function receiptCompress(file) {
  return new Promise(function(resolve) {
    if(file.type === 'application/pdf') { resolve(file); return; }
    var img = new Image();
    var url = URL.createObjectURL(file);
    img.onload = function() {
      var max = 1600, w = img.width, h = img.height;
      if(Math.max(w, h) > max) { var k = max / Math.max(w, h); w = Math.round(w*k); h = Math.round(h*k); }
      var c = document.createElement('canvas'); c.width = w; c.height = h;
      c.getContext('2d').drawImage(img, 0, 0, w, h);
      c.toBlob(function(b) { URL.revokeObjectURL(url); resolve(b || file); }, 'image/jpeg', 0.82);
    };
    img.onerror = function() { URL.revokeObjectURL(url); resolve(file); };
    img.src = url;
  });
}

function receiptOcrStatus(msg, hide) {
  var st = document.getElementById('receiptOcrStatus');
  if(!st) return;
  if(hide) { st.style.display = 'none'; return; }
  st.style.display = 'block';
  st.textContent = msg;
}

function receiptClear() {
  state.pendingReceipt = null;
  var pv = document.getElementById('receiptPreview');
  if(pv) { pv.style.display = 'none'; pv.innerHTML = ''; }
  receiptOcrStatus('', true);
}



function receiptLoadTesseract() {
  return new Promise(function(resolve, reject) {
    if(window.Tesseract) { resolve(); return; }
    var s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
    s.onload = resolve; s.onerror = reject;
    document.head.appendChild(s);
  });
}

function pdfLoadJs() {
  return new Promise(function(resolve, reject) {
    if(window.pdfjsLib) { resolve(); return; }
    var s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js';
    s.onload = function() {
      try {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
        resolve();
      } catch(e) { reject(e); }
    };
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

// Renders the first page of a PDF to a JPEG Blob so the existing image-based
// OCR pipeline (Tesseract) can run on it exactly like any photographed
// receipt/invoice — OCR engines read pixels, not PDF text streams.
function pdfRenderPageToImageBlob(page) {
  var viewport = page.getViewport({scale: 2}); // higher resolution improves OCR accuracy
  var canvas = document.createElement('canvas');
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  var ctx = canvas.getContext('2d');
  return page.render({canvasContext: ctx, viewport: viewport}).promise.then(function() {
    return new Promise(function(resolve) {
      canvas.toBlob(function(blob) { resolve(blob); }, 'image/jpeg', 0.9);
    });
  });
}

// Renders every page of a PDF to a JPEG Blob (capped at 15 pages — plenty for
// a real invoice, and keeps a stray huge PDF from freezing a mobile browser).
function pdfPagesToImageBlobs(file) {
  return pdfLoadJs().then(function() {
    return file.arrayBuffer();
  }).then(function(buf) {
    return window.pdfjsLib.getDocument({data: new Uint8Array(buf)}).promise;
  }).then(function(pdf) {
    var numPages = Math.min(pdf.numPages, 15);
    var pageNums = [];
    for(var i = 1; i <= numPages; i++) pageNums.push(i);
    return pageNums.reduce(function(chain, pageNum) {
      return chain.then(function(blobs) {
        return pdf.getPage(pageNum).then(pdfRenderPageToImageBlob).then(function(blob) {
          blobs.push(blob);
          return blobs;
        });
      });
    }, Promise.resolve([]));
  });
}

// Heuristic extraction of Brutto + MwSt rate from OCR text (German/English receipts)
function receiptParseOcr(text) {
  var lines = (text || '').split(/\n+/);
  function norm(s) {
    s = s.replace(/[^\d.,]/g, '');
    if(/,\d{2}$/.test(s)) s = s.replace(/\./g, '').replace(',', '.');   // 1.234,56 → 1234.56
    else s = s.replace(/,/g, '');                                       // 1,234.56 → 1234.56
    return parseFloat(s);
  }
  var amtRe = /\d{1,3}(?:[.,]\d{3})*[.,]\d{2}/g;
  var nettoKw = /netto/i;
  var bruttoKw = /(brutto|betrag|gesamtbetrag|endbetrag|zahlbetrag|zu zahlen|gesamt|total|summe)/i;
  var vatKw = /(mwst|ust|mehrwertsteuer|umsatzsteuer|vat|steuer)/i;
  var vatRateRe = /\b(\d{1,2}(?:[.,]\d{1,2})?)\s*%/; // read whatever rate is printed, don't assume a country's fixed rates
  var brutto = null, rate = null, best = 0;
  lines.forEach(function(ln) {
    if(rate == null && vatKw.test(ln)) {
      var rm = ln.match(vatRateRe);
      if(rm) rate = parseFloat(rm[1].replace(',', '.'));
    }
    var isNettoLine = nettoKw.test(ln);
    var ms = ln.match(amtRe);
    if(ms) ms.forEach(function(m) {
      var v = norm(m);
      if(!isFinite(v) || v <= 0 || v > 1000000) return;
      // A line labelled "Netto"/subtotal must never be mistaken for the Brutto
      // total, even if it also matches a generic word like "Summe" (e.g.
      // "Summe Netto") — netto and brutto are mutually exclusive by definition.
      if(!isNettoLine && bruttoKw.test(ln) && (brutto == null || v > brutto)) brutto = v;
      if(v > best) best = v;
    });
  });
  if(rate == null) { var rm2 = (text||'').match(vatRateRe); if(rm2) rate = parseFloat(rm2[1].replace(',', '.')); }
  return {brutto: brutto != null ? brutto : (best || null), rate: rate};
}

// Runs OCR on one or more image blobs (e.g. every rendered page of a
// multi-page PDF) and concatenates the recognized text, so parsing logic
// downstream always just sees a single block of text regardless of how many
// pages/images it came from.
function runOcrOnBlobs(blobs) {
  return receiptLoadTesseract().then(function() {
    return blobs.reduce(function(chain, blob) {
      return chain.then(function(textSoFar) {
        return Tesseract.recognize(blob, 'deu+eng').then(function(res) {
          return textSoFar + '\n' + (res && res.data ? res.data.text : '');
        });
      });
    }, Promise.resolve(''));
  });
}



// ── BATCH INVOICE SCAN: scan/upload multiple invoices, auto-create transactions ──
// ────────────────────────────────────────
var SCAN_L = {
  menuTitle:     {en:'Scan Invoices', ar:'مسح الفواتير', de:'Rechnungen scannen'},
  chooseTypeTitle:{en:'What kind of invoices?', ar:'الفواتير دي إيه نوعها؟', de:'Welche Art von Rechnungen?'},
  captureTitle:  {en:'Add Invoices', ar:'إضافة فواتير', de:'Rechnungen hinzufügen'},
  camera:        {en:'Camera', ar:'كاميرا', de:'Kamera'},
  upload:        {en:'Upload', ar:'رفع ملفات', de:'Hochladen'},
  addAnother:    {en:'+ Add another', ar:'+ إضافة كمان', de:'+ Weitere hinzufügen'},
  noFiles:       {en:'No invoices added yet', ar:'لسه مفيش فواتير مضافة', de:'Noch keine Rechnungen hinzugefügt'},
  analyzeBtn:    {en:'Analyze', ar:'تحليل', de:'Analysieren'},
  analyzing:     {en:'Analyzing invoice ', ar:'جاري تحليل فاتورة ', de:'Analysiere Rechnung '},
  reviewTitle:   {en:'Review & Confirm', ar:'مراجعة وتأكيد', de:'Überprüfen & Bestätigen'},
  reviewNote:    {en:'Extraction is automatic and may not be 100% accurate — please check the numbers before saving.', ar:'الاستخراج تلقائي وممكن ميبقاش دقيق ١٠٠٪ — راجع الأرقام قبل الحفظ.', de:'Die Erkennung ist automatisch und evtl. nicht 100% genau — bitte Zahlen vor dem Speichern prüfen.'},
  fieldItem:     {en:'What was bought/sold', ar:'الحاجة اللي اتشترت/اتباعت', de:'Was wurde gekauft/verkauft'},
  fieldItemPh:   {en:'e.g. Office supplies', ar:'مثال: مستلزمات مكتبية', de:'z.B. Büromaterial'},
  fieldCategory: {en:'Category', ar:'الفئة', de:'Kategorie'},
  fieldDate:     {en:'Date', ar:'التاريخ', de:'Datum'},
  fieldBrutto:   {en:'Total (Brutto)', ar:'الإجمالي (Brutto)', de:'Gesamtbetrag (Brutto)'},
  fieldVat:      {en:'VAT %', ar:'نسبة الضريبة %', de:'MwSt. %'},
  computedLine:  {en:'Netto ', ar:'Netto ', de:'Netto '},
  saveAllBtn:    {en:'Save All', ar:'حفظ الكل', de:'Alle speichern'},
  cancel:        {en:'Cancel', ar:'إلغاء', de:'Abbrechen'},
  back:          {en:'Back', ar:'رجوع', de:'Zurück'},
  savedToast:    {en:' invoice(s) added', ar:' فاتورة اتضافت', de:' Rechnung(en) hinzugefügt'},
  couldNotRead:  {en:'Could not read — fill in manually', ar:'معرفناش نقراها — اكتب يدوي', de:'Konnte nicht gelesen werden — bitte manuell eingeben'},
  removeBtn:     {en:'Remove', ar:'حذف', de:'Entfernen'},
  manualTitle:   {en:'Manual entry', ar:'إدخال يدوي', de:'Manuelle Eingabe'},
  manualNote:    {en:'Type everything in yourself. Adding an invoice is optional.', ar:'اكتب كل البيانات بإيدك. إضافة الفاتورة اختيارية.', de:'Alles selbst eintragen. Ein Beleg ist optional.'},
  noInvoice:     {en:'No invoice attached (optional)', ar:'مفيش فاتورة مرفقة (اختياري)', de:'Kein Beleg angehängt (optional)'},
  attachFile:    {en:'Upload file', ar:'رفع ملف', de:'Datei hochladen'},
  attachPhoto:   {en:'Take photo', ar:'تصوير', de:'Foto'},
  removeFile:    {en:'Remove invoice', ar:'شيل الفاتورة', de:'Beleg entfernen'},
  addEntry:      {en:'+ Another entry', ar:'+ قيد كمان', de:'+ Weiterer Eintrag'},
  saveBtn:       {en:'Save', ar:'حفظ', de:'Speichern'},
  needAmount:    {en:'Please enter a name and an amount', ar:'اكتب الاسم والمبلغ', de:'Bitte Name und Betrag eingeben'},
};
function scantx(k) { return (SCAN_L[k] && SCAN_L[k][state.lang]) || (SCAN_L[k] && SCAN_L[k].en) || k; }

var _scanInv = { type: null, files: [] };

// Foundation seam: today this runs local OCR (Tesseract) + heuristic parsing.
// Once a backend AI endpoint exists, replace the body of this function with
// a call to it — the return shape {date, brutto, rate} stays the same, so
// no other code (capture/review/save flow) needs to change.
function extractInvoiceData(file) {
  return new Promise(function(resolve) {
    var isPdf = file.type === 'application/pdf';
    var imagesReady = isPdf ? pdfPagesToImageBlobs(file).catch(function(){ return []; }) : Promise.resolve([file]);
    imagesReady.then(function(imgBlobs) {
      if(!imgBlobs || !imgBlobs.length) { resolve({date: null, brutto: null, rate: null}); return; }
      runOcrOnBlobs(imgBlobs).then(function(text) {
        var p = receiptParseOcr(text);
        resolve({date: invoiceExtractDate(text), brutto: p.brutto, rate: p.rate});
      }).catch(function() {
        resolve({date: null, brutto: null, rate: null});
      });
    });
  });
}

function invoiceExtractDate(text) {
  var lines = (text || '').split(/\n+/);
  var dateRe = /(\d{1,2})[.\/-](\d{1,2})[.\/-](\d{4})|(\d{4})-(\d{1,2})-(\d{1,2})/;
  var dateKw = /(rechnungsdatum|ausstellungsdatum|datum|invoice date|date)/i;
  var found = null;
  lines.forEach(function(ln) {
    if(found) return;
    if(dateKw.test(ln)) { var m = ln.match(dateRe); if(m) found = m; }
  });
  if(!found) { var m2 = (text||'').match(dateRe); if(m2) found = m2; }
  if(!found) return null;
  var y, mo, d;
  if(found[4]) { y = found[4]; mo = parseInt(found[5],10); d = parseInt(found[6],10); }
  else { d = parseInt(found[1],10); mo = parseInt(found[2],10); y = found[3]; }
  if(mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  return y + '-' + pad2(mo) + '-' + pad2(d);
}





function scanInvoicesOpenCapture() {
  var existing = document.getElementById('scanFlowOverlay');
  if(existing) existing.parentNode.removeChild(existing);

  var ov = document.createElement('div');
  ov.id = 'scanFlowOverlay';
  ov.style.cssText = 'position:fixed;inset:0;z-index:9999;background:var(--bg);overflow-y:auto;-webkit-overflow-scrolling:touch';
  document.body.appendChild(ov);
  scanInvoicesRenderCapture();
}

function scanInvoicesRenderCapture() {
  var ov = document.getElementById('scanFlowOverlay');
  if(!ov) return;
  var files = _scanInv.files;

  var html = '';
  html += '<div style="position:sticky;top:0;z-index:5;background:var(--card);padding:14px 16px;display:flex;align-items:center;gap:12px;border-bottom:1px solid var(--border)">';
  html += '<button id="scanCapBackBtn" style="background:none;border:none;color:var(--text);font-size:15px;cursor:pointer;padding:4px">' + scantx('back') + '</button>';
  html += '<div style="flex:1;font-size:16px;font-weight:700;text-align:center">' + scantx('captureTitle') + '</div>';
  html += '<div style="width:44px"></div>';
  html += '</div>';

  html += '<div style="padding:16px">';
  html += '<div style="display:flex;gap:10px;margin-bottom:16px">';
  html += '<button id="scanCapCameraBtn" style="flex:1;padding:16px;border-radius:12px;border:1.5px dashed var(--border);background:var(--card);color:var(--text2);font-size:13px;font-weight:600;cursor:pointer">' + svgIcon('camera',18) + '<div style="margin-top:6px">' + scantx('camera') + '</div></button>';
  html += '<button id="scanCapUploadBtn" style="flex:1;padding:16px;border-radius:12px;border:1.5px dashed var(--border);background:var(--card);color:var(--text2);font-size:13px;font-weight:600;cursor:pointer">' + svgIcon('upload',18) + '<div style="margin-top:6px">' + scantx('upload') + '</div></button>';
  html += '</div>';
  html += '<input type="file" id="scanCameraInput" accept="image/*" capture="environment" style="display:none">';
  html += '<input type="file" id="scanUploadInput" accept="image/*,application/pdf" multiple style="display:none">';

  html += '<div id="scanFileList">';
  if(!files.length) {
    html += '<div style="text-align:center;padding:24px;color:var(--text3);font-size:13px">' + scantx('noFiles') + '</div>';
  } else {
    files.forEach(function(f, idx) {
      html += '<div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--border)">';
      if(f.mimeType === 'application/pdf') {
        html += '<span style="color:var(--text2)">' + svgIcon('fileText',20) + '</span>';
      } else {
        html += '<img src="' + f.previewUrl + '" style="width:36px;height:36px;object-fit:cover;border-radius:6px">';
      }
      html += '<span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px">' + escHtml(f.name) + '</span>';
      html += '<button onclick="scanInvoicesRemoveFile(' + idx + ')" style="border:none;background:none;color:var(--text3);cursor:pointer;padding:6px">' + svgIcon('trash',14) + '</button>';
      html += '</div>';
    });
  }
  html += '</div>';

  html += '<button id="scanAnalyzeBtn" ' + (!files.length ? 'disabled' : '') + ' style="width:100%;margin-top:20px;padding:13px;border-radius:12px;border:none;background:' + (files.length ? 'var(--primary)' : 'var(--border)') + ';color:#fff;font-size:15px;font-weight:700;cursor:' + (files.length ? 'pointer' : 'default') + '">' + scantx('analyzeBtn') + (files.length ? ' (' + files.length + ')' : '') + '</button>';
  html += '</div>';

  ov.innerHTML = html;

  document.getElementById('scanCapBackBtn').onclick = function(){ ov.parentNode.removeChild(ov); };
  document.getElementById('scanCapCameraBtn').onclick = function(){ document.getElementById('scanCameraInput').click(); };
  document.getElementById('scanCapUploadBtn').onclick = function(){ document.getElementById('scanUploadInput').click(); };
  document.getElementById('scanCameraInput').onchange = function(e){ scanInvoicesFilesChosen(e.target.files); e.target.value = ''; };
  document.getElementById('scanUploadInput').onchange = function(e){ scanInvoicesFilesChosen(e.target.files); e.target.value = ''; };
  if(files.length) document.getElementById('scanAnalyzeBtn').onclick = scanInvoicesAnalyze;
}

function scanInvoicesFilesChosen(fileList) {
  var promises = [];
  for(var i=0;i<fileList.length;i++) {
    (function(f){
      var isPdf = f.type === 'application/pdf';
      promises.push(receiptCompress(f).then(function(blob) {
        _scanInv.files.push({
          blob: blob,
          name: f.name || ('invoice-' + Date.now() + (isPdf ? '.pdf' : '.jpg')),
          mimeType: isPdf ? 'application/pdf' : 'image/jpeg',
          previewUrl: isPdf ? null : URL.createObjectURL(blob),
          date: null, brutto: null, rate: null
        });
      }));
    })(fileList[i]);
  }
  Promise.all(promises).then(scanInvoicesRenderCapture);
}

function scanBlankEntry() {
  return {blob: null, name: '', mimeType: null, previewUrl: null, date: today(), brutto: null, rate: 20, manual: true};
}
// Keep what was typed when the review screen re-renders (attach / remove / add entry).
function scanReviewCollect() {
  _scanInv.files.forEach(function(f, idx) {
    var g = function(k) { return document.getElementById('scanRev-' + k + '-' + idx); };
    if(g('item')) f.item = g('item').value;
    if(g('cat')) f.category = g('cat').value;
    if(g('date')) f.date = g('date').value;
    if(g('brutto')) f.brutto = g('brutto').value === '' ? null : parseAmount(g('brutto').value);
    if(g('vat')) f.rate = parseFloat(g('vat').value) || 0;
  });
}
function scanEntryAttach(idx, mode) {
  var inp = document.getElementById(mode === 'camera' ? 'scanRevCam' : 'scanRevFile');
  if(!inp) return;
  inp.onchange = function(e) {
    var file = e.target.files && e.target.files[0];
    e.target.value = '';
    if(!file) return;
    scanReviewCollect();
    var isPdf = file.type === 'application/pdf';
    receiptCompress(file).then(function(blob) {
      var f = _scanInv.files[idx];
      if(!f) return;
      f.blob = blob;
      f.name = file.name || ('invoice-' + Date.now() + (isPdf ? '.pdf' : '.jpg'));
      f.mimeType = isPdf ? 'application/pdf' : 'image/jpeg';
      f.previewUrl = isPdf ? null : URL.createObjectURL(blob);
      scanInvoicesRenderReview();
    });
  };
  inp.click();
}
function scanEntryDetach(idx) {
  scanReviewCollect();
  var f = _scanInv.files[idx];
  if(f) { f.blob = null; f.name = ''; f.mimeType = null; f.previewUrl = null; }
  scanInvoicesRenderReview();
}
function scanAddEntry() {
  scanReviewCollect();
  _scanInv.files.push(scanBlankEntry());
  scanInvoicesRenderReview();
}

function scanInvoicesRemoveFile(idx) {
  _scanInv.files.splice(idx, 1);
  scanInvoicesRenderCapture();
}

function scanInvoicesAnalyze() {
  var ov = document.getElementById('scanFlowOverlay');
  if(!ov) return;
  var files = _scanInv.files;
  var total = files.length;
  var doneCount = 0;

  function renderProgress() {
    ov.innerHTML = '<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:14px;padding:24px;text-align:center">'
      + '<div class="spinner" style="width:36px;height:36px;border:3px solid var(--border);border-top-color:var(--primary);border-radius:50%;animation:spin 0.8s linear infinite"></div>'
      + '<div style="color:var(--text2);font-size:14px">' + scantx('analyzing') + (doneCount+1) + ' / ' + total + '</div>'
      + '</div>';
  }
  renderProgress();

  function processNext(i) {
    if(i >= files.length) { scanInvoicesRenderReview(); return; }
    extractInvoiceData(files[i].blob).then(function(data) {
      files[i].date = data.date;
      files[i].brutto = data.brutto;
      files[i].rate = data.rate;
      doneCount++;
      renderProgress();
      processNext(i+1);
    });
  }
  processNext(0);
}

function scanInvoicesRenderReview() {
  var ov = document.getElementById('scanFlowOverlay');
  if(!ov) return;
  var files = _scanInv.files;

  var html = '';
  html += '<div style="position:sticky;top:0;z-index:5;background:var(--card);padding:14px 16px;display:flex;align-items:center;gap:12px;border-bottom:1px solid var(--border)">';
  html += '<button id="scanRevCancelBtn" style="background:none;border:none;color:var(--text);font-size:15px;cursor:pointer;padding:4px">' + scantx('cancel') + '</button>';
  html += '<div style="flex:1;font-size:16px;font-weight:700;text-align:center">' + scantx(_scanInv.manual ? 'manualTitle' : 'reviewTitle') + '</div>';
  html += '<div style="width:44px"></div>';
  html += '</div>';

  html += '<div style="padding:16px">';
  html += '<div style="font-size:12px;color:var(--text3);background:var(--card);border-radius:10px;padding:10px 12px;margin-bottom:14px">' + scantx(_scanInv.manual ? 'manualNote' : 'reviewNote') + '</div>';
  html += '<input type="file" id="scanRevFile" accept="image/*,application/pdf" style="display:none">';
  html += '<input type="file" id="scanRevCam" accept="image/*" capture="environment" style="display:none">';

  files.forEach(function(f, idx) {
    var brutto = parseFloat(f.brutto) || 0;
    var rate = f.rate != null ? f.rate : 20;
    var b = vatBreakdown(brutto, rate);
    html += '<div style="background:var(--card);border-radius:14px;padding:14px;margin-bottom:12px;box-shadow:var(--shadow)">';
    html += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">';
    if(!f.blob) {
      html += '<span style="color:var(--text3)">' + svgIcon('paperclip',18) + '</span>';
      html += '<span style="flex:1;font-size:12px;color:var(--text3)">' + scantx('noInvoice') + '</span>';
    } else {
      if(f.mimeType === 'application/pdf') html += '<span style="color:var(--text2)">' + svgIcon('fileText',20) + '</span>';
      else html += '<img src="' + f.previewUrl + '" style="width:36px;height:36px;object-fit:cover;border-radius:6px">';
      html += '<span style="flex:1;font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + escHtml(f.name) + '</span>';
      if(f.manual) html += '<button type="button" onclick="scanEntryDetach(' + idx + ')" title="' + escHtml(scantx('removeFile')) + '" style="border:none;background:none;color:var(--text3);cursor:pointer;padding:4px">' + svgIcon('x',14) + '</button>';
    }
    html += '<button onclick="scanInvoicesRemoveReviewItem(' + idx + ')" style="border:none;background:none;color:var(--text3);cursor:pointer;padding:4px">' + svgIcon('trash',14) + '</button>';
    html += '</div>';
    if(f.manual && !f.blob) {
      var ab = 'flex:1;display:flex;align-items:center;justify-content:center;gap:6px;padding:9px;border-radius:10px;border:1.5px dashed var(--border);background:none;color:var(--text2);font-size:12px;font-weight:600;cursor:pointer;font-family:inherit';
      html += '<div style="display:flex;gap:8px;margin-bottom:10px">'
        + '<button type="button" style="' + ab + '" onclick="scanEntryAttach(' + idx + ',\'upload\')">' + svgIcon('upload',14) + scantx('attachFile') + '</button>'
        + '<button type="button" style="' + ab + '" onclick="scanEntryAttach(' + idx + ',\'camera\')">' + svgIcon('camera',14) + scantx('attachPhoto') + '</button>'
        + '</div>';
    }
    if(f.brutto == null && !f.manual) {
      html += '<div style="font-size:11px;color:#ea580c;margin-bottom:8px">' + scantx('couldNotRead') + '</div>';
    }
    html += '<label style="font-size:11px;color:var(--text3);display:block;margin-bottom:3px">' + scantx('fieldItem') + '</label>';
    html += '<input type="text" id="scanRev-item-' + idx + '" class="input-field" style="margin-bottom:8px" placeholder="' + scantx('fieldItemPh') + '" value="' + escHtml(f.item || '') + '">';
    html += '<label style="font-size:11px;color:var(--text3);display:block;margin-bottom:3px">' + scantx('fieldCategory') + '</label>';
    html += '<select id="scanRev-cat-' + idx + '" class="input-field" style="margin-bottom:8px">';
    (CATS[_scanInv.type] || []).forEach(function(cat) {
      html += '<option value="' + cat + '"' + (cat === (f.category || CATS[_scanInv.type][0]) ? ' selected' : '') + '>' + tc(cat) + '</option>';
    });
    html += '</select>';
    html += '<label style="font-size:11px;color:var(--text3);display:block;margin-bottom:3px">' + scantx('fieldDate') + '</label>';
    html += '<div class="date-fix-wrap"><input type="date" id="scanRev-date-' + idx + '" class="input-field" style="margin-bottom:8px" value="' + (f.date || today()) + '"></div>';
    html += '<div style="display:flex;gap:8px">';
    html += '<div style="flex:1"><label style="font-size:11px;color:var(--text3);display:block;margin-bottom:3px">' + scantx('fieldBrutto') + '</label><input type="text" inputmode="decimal" id="scanRev-brutto-' + idx + '" oninput="sanitizeAmountField(this);scanInvoicesRecalc(' + idx + ')" class="input-field" style="margin-bottom:0" value="' + (brutto || '') + '"></div>';
    html += '<div style="width:90px"><label style="font-size:11px;color:var(--text3);display:block;margin-bottom:3px">' + scantx('fieldVat') + '</label><input type="number" min="0" max="100" step="0.1" id="scanRev-vat-' + idx + '" oninput="scanInvoicesRecalc(' + idx + ')" class="input-field" style="margin-bottom:0" value="' + rate + '"></div>';
    html += '</div>';
    html += '<div id="scanRev-computed-' + idx + '" style="font-size:12px;color:var(--text3);margin-top:8px">' + scantx('computedLine') + fmt(b.netto) + '</div>';
    html += '</div>';
  });

  if(_scanInv.manual) html += '<button type="button" onclick="scanAddEntry()" style="width:100%;padding:11px;border-radius:12px;border:1.5px dashed var(--border);background:none;color:var(--text2);font-size:13px;font-weight:600;cursor:pointer;font-family:inherit">' + scantx('addEntry') + '</button>';
  html += '<button id="scanSaveAllBtn" style="width:100%;margin-top:10px;padding:14px;border-radius:12px;border:none;background:var(--primary);color:#fff;font-size:15px;font-weight:700;cursor:pointer">' + (_scanInv.manual && files.length === 1 ? scantx('saveBtn') : scantx('saveAllBtn') + ' (' + files.length + ')') + '</button>';
  html += '</div>';

  ov.innerHTML = html;

  document.getElementById('scanRevCancelBtn').onclick = function(){ ov.parentNode.removeChild(ov); };
  document.getElementById('scanSaveAllBtn').onclick = scanInvoicesSaveAll;
}

function scanInvoicesRecalc(idx) {
  var bruttoEl = document.getElementById('scanRev-brutto-' + idx);
  var vatEl = document.getElementById('scanRev-vat-' + idx);
  var computedEl = document.getElementById('scanRev-computed-' + idx);
  if(!bruttoEl || !vatEl || !computedEl) return;
  var brutto = parseAmount(bruttoEl.value) || 0;
  var rate = parseFloat(vatEl.value) || 0;
  var b = vatBreakdown(brutto, rate);
  computedEl.textContent = scantx('computedLine') + fmt(b.netto);
}

function scanInvoicesRemoveReviewItem(idx) {
  scanReviewCollect();
  _scanInv.files.splice(idx, 1);
  if(!_scanInv.files.length) { var ov = document.getElementById('scanFlowOverlay'); if(ov) ov.parentNode.removeChild(ov); return; }
  scanInvoicesRenderReview();
}

function scanInvoicesSaveAll() {
  var files = _scanInv.files;
  var type = _scanInv.type;
  var savedCount = 0;
  var savedDates = [];

  files.forEach(function(f, idx) {
    var dateEl = document.getElementById('scanRev-date-' + idx);
    var bruttoEl = document.getElementById('scanRev-brutto-' + idx);
    var vatEl = document.getElementById('scanRev-vat-' + idx);
    var itemEl = document.getElementById('scanRev-item-' + idx);
    var catEl = document.getElementById('scanRev-cat-' + idx);
    var date = (dateEl && dateEl.value) || today();
    var brutto = parseAmount(bruttoEl ? bruttoEl.value : '') || 0;
    var rate = parseFloat(vatEl ? vatEl.value : '') || 0;
    var itemName = (itemEl && itemEl.value.trim()) || f.name;
    var category = (catEl && catEl.value) || CATS[type][0];
    if(brutto <= 0 || !itemName) return;

    var newTxId = Date.now() + idx;
    var tx = {
      id: newTxId,
      name: itemName,
      amount: brutto, type: type, category: category, date: date,
      vatRate: rate
    };
    if(f.manual) tx.manual = true;
    if(f.blob) { tx.receiptId = newTxId; tx.receiptName = f.name; }
    state.transactions.push(tx);
    savedCount++;
    savedDates.push(date);
    if(!f.blob) return;
    receiptPut({
      id: newTxId,
      user: localStorage.getItem('smartac_user') || '',
      name: f.name,
      type: f.mimeType,
      blob: f.blob,
      createdAt: new Date().toISOString()
    }).catch(function(){});
  });
  if(!savedCount) { showToast(scantx('needAmount'), 'error'); return; }

  // Scanned invoices often carry an old real-world date. If the currently
  // active period/custom filter would hide any of what was just saved
  // (e.g. filter is "This Month" but the invoice is from last year), switch
  // to a custom range covering the saved dates so the user actually sees
  // what they just added instead of it silently vanishing from view.
  if(savedDates.length && !savedDates.every(txDateMatchesFilter)) {
    // Show the month the invoice actually belongs to, not the one that happened to be open.
    goToDate(savedDates.reduce(function(a,b){ return b < a ? b : a; }));
  }

  save();
  var ov = document.getElementById('scanFlowOverlay');
  if(ov) ov.parentNode.removeChild(ov);
  showToast(savedCount + scantx('savedToast'), 'success');
  showNav('home');
  renderCustomDateActiveBar();
}

// ────────────────────────────────────────
// ── EMPLOYEE DOCUMENTS: upload + naming + expiry alerts ──
// ────────────────────────────────────────
function empDocDb() {
  return new Promise(function(resolve, reject) {
    if(window._empDocDbInst) { resolve(window._empDocDbInst); return; }
    var req = indexedDB.open('smartac_empdocs', 1);
    req.onupgradeneeded = function(e) {
      var db = e.target.result;
      if(!db.objectStoreNames.contains('docs')) db.createObjectStore('docs', {keyPath:'id'});
    };
    req.onsuccess = function(e) { window._empDocDbInst = e.target.result; resolve(window._empDocDbInst); };
    req.onerror = function() { reject(req.error); };
  });
}
function empDocPut(rec) {
  return empDocDb().then(function(db) {
    return new Promise(function(res, rej) {
      var t = db.transaction('docs', 'readwrite');
      t.objectStore('docs').put(rec);
      t.oncomplete = res; t.onerror = function(){ rej(t.error); };
    });
  });
}
function empDocGet(id) {
  return empDocDb().then(function(db) {
    return new Promise(function(res, rej) {
      var r = db.transaction('docs').objectStore('docs').get(id);
      r.onsuccess = function(){ res(r.result); }; r.onerror = function(){ rej(r.error); };
    });
  });
}
function empDocDeleteRec(id) {
  return empDocDb().then(function(db) {
    return new Promise(function(res) {
      var t = db.transaction('docs', 'readwrite');
      t.objectStore('docs').delete(id);
      t.oncomplete = res; t.onerror = res;
    });
  }).catch(function(){});
}

var _empDocPendingFile = null; // {blob, type}

function empDocFileChosen(input, empId) {
  var f = input.files && input.files[0];
  input.value = '';
  if(!f) return;
  var isPdf = f.type === 'application/pdf';
  receiptCompress(f).then(function(blob) {
    _empDocPendingFile = {blob: blob, type: isPdf ? 'application/pdf' : 'image/jpeg'};
    empDocOpenNamePrompt(empId, f.name || '');
  });
}

function empDocOpenNamePrompt(empId, suggestedName) {
  var existing = document.getElementById('empDocNameOverlay');
  if(existing) existing.parentNode.removeChild(existing);
  if(!_empDocPendingFile) return;

  var ov = document.createElement('div');
  ov.id = 'empDocNameOverlay';
  ov.className = 'modal-overlay open';
  ov.style.zIndex = '99999'; // above the full-screen employee profile overlay (z-index 9999)
  var defaultName = suggestedName.replace(/\.[^.]+$/, '');
  var html = '';
  html += '<div class="modal" id="empDocNameModal">';
  html += '<button class="modal-close-btn" id="empDocNameCloseBtn">' + svgIcon('x', 16) + '</button>';
  html += '<div class="modal-handle"></div>';
  html += '<div class="modal-title">' + emptx('docSave') + '</div>';
  html += '<input class="input-field" id="edn-name" placeholder="' + emptx('docNamePh') + '" value="' + escHtml(defaultName) + '">';
  html += '<label style="font-size:12px;color:var(--text3);display:block;margin-bottom:4px">' + emptx('docExpiry') + '</label>';
  html += '<div class="date-fix-wrap"><input class="input-field" id="edn-expiry" type="date"></div>';
  html += '<div style="display:flex;gap:10px;margin-top:10px">';
  html += '<button id="edn-saveBtn" style="flex:1;background:var(--primary);color:#fff;border:none;border-radius:12px;padding:13px;font-size:15px;font-weight:700;cursor:pointer">' + emptx('docSave') + '</button>';
  html += '<button id="edn-cancelBtn" style="flex:1;background:var(--bg);color:var(--text2);border:1.5px solid var(--border);border-radius:12px;padding:13px;font-size:15px;font-weight:600;cursor:pointer">' + emptx('docCancel') + '</button>';
  html += '</div></div>';
  ov.innerHTML = html;
  document.body.appendChild(ov);

  function close() {
    _empDocPendingFile = null;
    var o = document.getElementById('empDocNameOverlay');
    if(o) o.parentNode.removeChild(o);
  }
  document.getElementById('empDocNameCloseBtn').onclick = close;
  document.getElementById('edn-cancelBtn').onclick = close;
  ov.onclick = function(e) { if(e.target === ov) close(); };
  document.getElementById('edn-saveBtn').onclick = function() {
    var nameEl = document.getElementById('edn-name');
    var name = nameEl.value.trim();
    if(!name) { nameEl.focus(); return; }
    var expiry = document.getElementById('edn-expiry').value || '';
    empDocSave(empId, name, expiry);
    close();
  };
}

function empDocSave(empId, name, expiryDate) {
  var emp = (state.employees || []).find(function(e){ return e.id === empId; });
  if(!emp || !_empDocPendingFile) return;
  var docId = Date.now();
  var pending = _empDocPendingFile;
  empDocPut({
    id: docId,
    empId: empId,
    user: localStorage.getItem('smartac_user') || '',
    name: name,
    type: pending.type,
    blob: pending.blob,
    createdAt: new Date().toISOString()
  }).then(function() {
    if(!emp.documents) emp.documents = [];
    emp.documents.push({id: docId, name: name, type: pending.type, expiryDate: expiryDate || '', createdAt: new Date().toISOString()});
    save();
    _empDocPendingFile = null;
    renderEmpDocsSection(emp);
    checkAppointmentReminders();
  });
}

async function empDocDelete(empId, docId) {
  if(!(await confirmAsync(DELETE_CONFIRM_TITLE[state.lang]||DELETE_CONFIRM_TITLE.en, emptx('confirmDeleteDoc')))) return;
  var emp = (state.employees || []).find(function(e){ return e.id === empId; });
  if(!emp) return;
  emp.documents = (emp.documents || []).filter(function(d){ return d.id !== docId; });
  save();
  empDocDeleteRec(docId);
  renderEmpDocsSection(emp);
}

function empDocView(docId) {
  empDocGet(docId).then(function(rec) { if(rec) openReceiptViewer(rec); });
}

function empDocExpiryBadge(expiryDate) {
  if(!expiryDate) return '';
  var days = Math.round((new Date(expiryDate + 'T00:00:00') - new Date(today() + 'T00:00:00')) / 86400000);
  var label = emptx('docExpiresOn') + ' ' + formatDateDisplay(expiryDate);
  var color = 'var(--text3)', bg = 'var(--bg)';
  if(days < 0) { label = emptx('docExpired') + ' · ' + formatDateDisplay(expiryDate); color = '#ef4444'; bg = 'rgba(239,68,68,0.1)'; }
  else if(days <= 30) { label = emptx('docExpiresSoon') + ' · ' + formatDateDisplay(expiryDate); color = '#ea580c'; bg = 'rgba(234,88,12,0.1)'; }
  return '<span style="font-size:11px;font-weight:600;color:' + color + ';background:' + bg + ';padding:2px 8px;border-radius:8px;white-space:nowrap">' + label + '</span>';
}

function renderEmpDocsSection(emp) {
  var wrap = document.getElementById('empDocList');
  if(!wrap) return;
  var docs = emp.documents || [];
  if(!docs.length) {
    wrap.innerHTML = '<div style="text-align:center;padding:16px;color:var(--text3);font-size:13px">' + emptx('docNoDocs') + '</div>';
    return;
  }
  var h = '';
  docs.forEach(function(doc) {
    var isPdf = doc.type === 'application/pdf';
    h += '<div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--border)">';
    h += '<span style="font-size:18px;flex-shrink:0">' + (isPdf ? svgIcon('fileText', 20) : svgIcon('paperclip', 20)) + '</span>';
    h += '<div style="flex:1;min-width:0;cursor:pointer" onclick="empDocView(' + doc.id + ')">';
    h += '<div style="font-size:14px;font-weight:600;color:var(--primary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + escHtml(doc.name) + '</div>';
    if(doc.expiryDate) h += '<div style="margin-top:3px">' + empDocExpiryBadge(doc.expiryDate) + '</div>';
    h += '</div>';
    h += '<button onclick="empDocDelete(' + emp.id + ',' + doc.id + ')" style="border:none;background:none;color:var(--text3);cursor:pointer;padding:6px;flex-shrink:0">' + svgIcon('trash', 15) + '</button>';
    h += '</div>';
  });
  wrap.innerHTML = h;
}

// ────────────────────────────────────────
// ── DOCUMENT ARCHIVE: folders + files (PDF/image) + notes ──
// ────────────────────────────────────────
var ARCH_L = {
  title:            {en:'Archive', ar:'الأرشيف', de:'Archiv'},
  newFolder:        {en:'+ New Folder', ar:'+ فولدر جديد', de:'+ Neuer Ordner'},
  newFolderTitle:   {en:'New Folder', ar:'فولدر جديد', de:'Neuer Ordner'},
  renameFolderTitle:{en:'Rename Folder', ar:'إعادة تسمية الفولدر', de:'Ordner umbenennen'},
  folderNamePh:     {en:'Folder name (e.g. Company Registration)', ar:'اسم الفولدر (مثال: أوراق تسجيل الشركة)', de:'Ordnername (z.B. Firmenunterlagen)'},
  empty:            {en:'No folders yet.\nCreate one to start archiving documents.', ar:'لا توجد فولدرات بعد.\nأنشئ واحدًا عشان تبدأ تؤرشف مستنداتك.', de:'Noch keine Ordner.\nErstellen Sie einen, um Dokumente zu archivieren.'},
  docsCount:        {en:'documents', ar:'مستند', de:'Dokumente'},
  addDoc:           {en:'+ Add Document', ar:'+ إضافة مستند', de:'+ Dokument hinzufügen'},
  camera:           {en:'Camera', ar:'كاميرا', de:'Kamera'},
  upload:           {en:'Upload', ar:'رفع ملف', de:'Hochladen'},
  emptyDocs:        {en:'No documents in this folder yet', ar:'لا توجد مستندات في هذا الفولدر بعد', de:'Noch keine Dokumente in diesem Ordner'},
  docNamePh:        {en:'Document name', ar:'اسم المستند', de:'Dokumentname'},
  notePh:           {en:'Note / comment (optional)', ar:'ملاحظة / تعليق (اختياري)', de:'Notiz / Kommentar (optional)'},
  editDocTitle:     {en:'Edit Document', ar:'تعديل المستند', de:'Dokument bearbeiten'},
  save:             {en:'Save', ar:'حفظ', de:'Speichern'},
  cancel:           {en:'Cancel', ar:'إلغاء', de:'Abbrechen'},
  confirmDeleteDoc: {en:'Delete this document?', ar:'حذف هذا المستند؟', de:'Dieses Dokument löschen?'},
};


function archiveDb() {
  return new Promise(function(resolve, reject) {
    if(window._archiveDbInst) { resolve(window._archiveDbInst); return; }
    var req = indexedDB.open('smartac_archive', 1);
    req.onupgradeneeded = function(e) {
      var db = e.target.result;
      if(!db.objectStoreNames.contains('docs')) db.createObjectStore('docs', {keyPath:'id'});
    };
    req.onsuccess = function(e) { window._archiveDbInst = e.target.result; resolve(window._archiveDbInst); };
    req.onerror = function() { reject(req.error); };
  });
}
function archivePut(rec) {
  return archiveDb().then(function(db) {
    return new Promise(function(res, rej) {
      var t = db.transaction('docs', 'readwrite');
      t.objectStore('docs').put(rec);
      t.oncomplete = res; t.onerror = function(){ rej(t.error); };
    });
  });
}
function archiveGet(id) {
  return archiveDb().then(function(db) {
    return new Promise(function(res, rej) {
      var r = db.transaction('docs').objectStore('docs').get(id);
      r.onsuccess = function(){ res(r.result); }; r.onerror = function(){ rej(r.error); };
    });
  });
}




// Shared modal for both "new folder" and "rename folder" (folderId null = new)






var _archivePendingFile = null;

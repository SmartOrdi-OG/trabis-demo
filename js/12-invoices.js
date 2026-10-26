// ── INVOICE FUNCTIONS ──


function clearInvoice() {
  state.pendingInvoice = null;
  state.pendingInvoiceName = null;
  var input = document.getElementById('invoiceInput');
  if (input) input.value = '';
  var preview = document.getElementById('invoicePreview');
  if (preview) preview.style.display = 'none';
}

function closeIvOverlay() {
  var o = document.getElementById("ivOverlay");
  if(o) o.style.display = "none";
}

function openInvoice(dataUrl, name) {
  if (!dataUrl) return;
  var overlay = document.getElementById("ivOverlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "ivOverlay";
    overlay.style.cssText = "position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.96);z-index:600000;display:flex;flex-direction:column";
    document.body.appendChild(overlay);
  }
  var header = document.createElement("div");
  header.style.cssText = "display:flex;align-items:center;padding:12px 16px;background:#111;flex-shrink:0";
  var title = document.createElement("div");
  title.style.cssText = "color:#fff;font-size:13px;flex:1;opacity:0.8;overflow:hidden;text-overflow:ellipsis;white-space:nowrap";
  title.textContent = name || "Invoice";
  var closeBtn = document.createElement("button");
  closeBtn.innerHTML = svgIcon('x',16);
  closeBtn.style.cssText = "background:rgba(255,255,255,0.15);border:none;color:#fff;font-size:20px;width:36px;height:36px;border-radius:50%;cursor:pointer;flex-shrink:0;margin-left:12px";
  closeBtn.onclick = closeIvOverlay;
  header.appendChild(title);
  header.appendChild(closeBtn);
  var body = document.createElement("div");
  body.style.cssText = "flex:1;overflow:auto;-webkit-overflow-scrolling:touch;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:12px";
  var isPdf = dataUrl.indexOf('data:application/pdf') === 0 || dataUrl.indexOf('data:application/octet-stream') === 0 || /\.pdf$/i.test(name || '');
  if (isPdf) {
    var embed = document.createElement("embed");
    embed.src = dataUrl;
    embed.type = "application/pdf";
    embed.style.cssText = "width:100%;height:80vh;border-radius:8px";
    body.appendChild(embed);
    var fallbackLink = document.createElement("a");
    fallbackLink.href = dataUrl;
    fallbackLink.download = name || "invoice.pdf";
    fallbackLink.textContent = "Can't see the PDF? Tap to download";
    fallbackLink.style.cssText = "color:#5ba8e8;font-size:13px;margin-top:10px;text-align:center;text-decoration:underline";
    body.appendChild(fallbackLink);
  } else {
    var img = document.createElement("img");
    img.src = dataUrl;
    img.style.cssText = "max-width:100%;max-height:85vh;border-radius:10px;object-fit:contain";
    body.appendChild(img);
  }
  overlay.innerHTML = "";
  overlay.appendChild(header);
  overlay.appendChild(body);
  overlay.style.display = "flex";
}




var _activeInvoiceTab = 'issued';

function switchInvoiceTab(tab) {
  _activeInvoiceTab = tab;
  var tabs = ['issued','receipts','received'];
  for(var i=0;i<tabs.length;i++) {
    var btn = document.getElementById('invtab_'+tabs[i]);
    var div = document.getElementById('invlist_'+tabs[i]);
    if(btn) {
      btn.style.background = (tabs[i]===tab) ? 'var(--primary)' : 'var(--card)';
      btn.style.color = (tabs[i]===tab) ? '#fff' : 'var(--text)';
    }
    if(div) div.style.display = (tabs[i]===tab) ? 'block' : 'none';
  }
  var fab = document.getElementById('inv_fab');
  if(fab) {
    if(tab==='issued') { fab.onclick = function(){ openIssuedInvoiceForm(); }; }
    else if(tab==='receipts') { fab.onclick = function(){ openReceiptForm(); }; }
    else { fab.onclick = function(){ openReceivedInvoiceForm(); }; }
  }
}

var INV_L = {
  pageTitle:    {en:'Invoices', ar:'الفواتير', de:'Rechnungen'},
  issued:       {en:'Issued', ar:'الصادرة', de:'Ausgestellt'},
  receiptsTab:  {en:'Receipts', ar:'الإيصالات', de:'Quittungen'},
  received:     {en:'Received', ar:'المستلمة', de:'Erhalten'},
  pending:      {en:'Pending', ar:'معلقة', de:'Ausstehend'},
  paid:         {en:'Paid', ar:'مدفوعة', de:'Bezahlt'},
  overdue:      {en:'Overdue', ar:'متأخرة', de:'Überfällig'},
  deleteLbl:    {en:'Delete', ar:'حذف', de:'Löschen'},
  shareLbl:     {en:'Share', ar:'مشاركة', de:'Teilen'},
  viewPrint:    {en:'View/Print', ar:'عرض/طباعة', de:'Anzeigen/Drucken'},
  noItems:      {en:'No items yet.', ar:'لا توجد عناصر بعد.', de:'Noch keine Einträge.'},
  newInvoice:   {en:'New Invoice', ar:'فاتورة جديدة', de:'Neue Rechnung'},
  newReceipt:   {en:'New Receipt', ar:'إيصال جديد', de:'Neue Quittung'},
  newReceived:  {en:'New Received Invoice', ar:'فاتورة واردة جديدة', de:'Neue Eingangsrechnung'},
  invoiceNumber:{en:'Invoice Number', ar:'رقم الفاتورة', de:'Rechnungsnummer'},
  issueDateLbl: {en:'Issue Date', ar:'تاريخ الإصدار', de:'Ausstellungsdatum'},
  dueDateLbl:   {en:'Due Date', ar:'تاريخ الاستحقاق', de:'Fälligkeitsdatum'},
  lineItems:    {en:'Line Items', ar:'بنود الفاتورة', de:'Positionen'},
  addItem:      {en:'+ Add Item', ar:'+ إضافة بند', de:'+ Position hinzufügen'},
  descPh:       {en:'Description', ar:'الوصف', de:'Beschreibung'},
  qtyPh:        {en:'Qty', ar:'الكمية', de:'Menge'},
  pricePh:      {en:'Price', ar:'السعر', de:'Preis'},
  vatLbl:       {en:'VAT', ar:'ضريبة القيمة المضافة', de:'MwSt.'},
  notesLbl:     {en:'Notes (optional)', ar:'ملاحظات (اختياري)', de:'Notizen (optional)'},
  notesPh:      {en:'Additional notes...', ar:'ملاحظات إضافية...', de:'Zusätzliche Notizen...'},
  statusLbl:    {en:'Status', ar:'الحالة', de:'Status'},
  subtotalLbl:  {en:'Subtotal', ar:'المجموع الفرعي', de:'Zwischensumme'},
  totalLbl:     {en:'Total', ar:'الإجمالي', de:'Gesamt'},
  saveLbl:      {en:'Save', ar:'حفظ', de:'Speichern'},
  printPreview: {en:'Print Preview', ar:'معاينة الطباعة', de:'Druckvorschau'},
  paymentMethod:{en:'Payment Method', ar:'طريقة الدفع', de:'Zahlungsmethode'},
  cashOpt:      {en:'Cash', ar:'نقدي', de:'Bargeld'},
  bankTransferOpt:{en:'Bank Transfer', ar:'تحويل بنكي', de:'Banküberweisung'},
  cardOpt:      {en:'Card', ar:'بطاقة', de:'Karte'},
  otherOpt:     {en:'Other', ar:'أخرى', de:'Sonstiges'},
  confirmDeleteInv:{en:'Delete this invoice?', ar:'حذف هذه الفاتورة؟', de:'Diese Rechnung löschen?'},
  confirmDeleteRec:{en:'Delete this receipt?', ar:'حذف هذا الإيصال؟', de:'Diese Quittung löschen?'},
  invoiceNumLbl: {en:'Invoice Number', ar:'رقم الفاتورة', de:'Rechnungsnummer'},
  markAsPaid:    {en:svgIcon('check',12)+' Mark as Paid', ar:svgIcon('check',12)+' تحديد كمدفوعة', de:svgIcon('check',12)+' Als bezahlt markieren'},
  markAsPending: {en:svgIcon('exchange',12)+' Mark as Pending', ar:svgIcon('exchange',12)+' تحديد كمعلقة', de:svgIcon('exchange',12)+' Als ausstehend markieren'},
  downloadPdfLbl:{en:svgIcon('download',12)+' PDF', ar:svgIcon('download',12)+' PDF', de:svgIcon('download',12)+' PDF'},
  downloadingPdf:{en:'Downloading PDF...', ar:'جاري تنزيل PDF...', de:'PDF wird heruntergeladen...'},
};
function itx(k) { return (INV_L[k] && INV_L[k][state.lang]) || (INV_L[k] && INV_L[k].en) || k; }
function invStatusLabel(s) { if(s==='Paid') return itx('paid'); if(s==='Overdue') return itx('overdue'); return itx('pending'); }

function _renderInvoiceList(items, colorIsGreen, deleteFunc, type) {
  if(!items || !items.length) {
    return '<div style="text-align:center;padding:40px;color:var(--text3);font-size:14px">' + itx('noItems') + '</div>';
  }
  var h = '';
  for(var i=items.length-1;i>=0;i--) {
    var inv = items[i];
    var statusColor = inv.status==='Paid' ? '#006e1c' : inv.status==='Overdue' ? '#bb1614' : '#d97706';
    var amtColor = colorIsGreen ? '#006e1c' : '#bb1614';
    var name = inv.clientName || inv.supplierName || '';
    var ref = inv.number || '';
    var amt = parseFloat(inv.total||0);
    var amtStr = state.currency + (amt.toFixed ? amt.toFixed(2) : amt);
    var dateStr = formatDateDisplay(inv.issueDate || '');
    h += '<div style="background:var(--card);border-radius:14px;padding:12px 14px;margin-bottom:10px;box-shadow:var(--shadow)">';
    h += '<div class="inv-card-row" style="display:flex;align-items:flex-start;gap:10px">';
    h += '<div style="flex:1;min-width:0">';
    h += '<div class="inv-card-headrow" style="display:none;align-items:center;justify-content:space-between;gap:8px;margin-bottom:2px">';
    h += '<div class="inv-card-ref" style="font-size:13px;font-weight:700;min-width:0">' + ref + '</div>';
    h += '<span class="inv-card-status-mobile" style="background:' + statusColor + ';color:#fff;border-radius:20px;padding:2px 10px;font-size:11px;font-weight:700;flex-shrink:0">' + invStatusLabel(inv.status) + '</span>';
    h += '</div>';
    h += '<div class="inv-card-ref-desktop" style="font-size:13px;font-weight:700;margin-bottom:2px">' + ref + '</div>';
    h += '<div style="font-size:12px;color:var(--text3);margin-bottom:2px">' + name + '</div>';
    h += '<div class="amount" style="font-size:14px;font-weight:700;color:' + amtColor + ';margin-bottom:4px">' + amtStr + '</div>';
    h += '<div class="inv-card-date" style="font-size:11px;color:var(--text3)">' + dateStr + '</div>';
    h += '</div>';
    h += '<div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px;flex-shrink:0">';
    h += '<span class="inv-card-status-desktop" style="background:' + statusColor + ';color:#fff;border-radius:20px;padding:2px 10px;font-size:11px;font-weight:700">' + invStatusLabel(inv.status) + '</span>';
    h += '<div class="inv-card-btns" style="display:flex;gap:5px;margin-top:4px">';
    h += '<button class="inv-card-btn" id="invview_' + type + '_' + i + '" style="background:var(--primary);color:#fff;border:none;border-radius:8px;padding:5px 10px;font-size:11px;font-weight:600;cursor:pointer">' + itx('viewPrint') + '</button>';
    h += '<button class="inv-card-btn" id="invpdf_' + type + '_' + i + '" style="background:var(--card);border:1.5px solid var(--border);color:var(--text);border-radius:8px;padding:6px 10px;font-size:12px;font-weight:600;cursor:pointer">' + itx('downloadPdfLbl') + '</button>';
    if(inv.status === 'Paid') {
      h += '<button class="inv-card-btn" id="invtoggle_' + type + '_' + i + '" style="border:1.5px solid var(--border);color:var(--text2);background:transparent;border-radius:8px;padding:6px 10px;font-size:12px;font-weight:600;cursor:pointer">' + itx('markAsPending') + '</button>';
    } else {
      h += '<button class="inv-card-btn" id="invtoggle_' + type + '_' + i + '" style="border:1.5px solid var(--green);color:var(--green);background:transparent;border-radius:8px;padding:6px 10px;font-size:12px;font-weight:600;cursor:pointer">' + itx('markAsPaid') + '</button>';
    }
    h += '<button class="inv-card-btn" id="invdel_' + type + '_' + i + '" style="background:#ff4444;color:#fff;border:none;border-radius:8px;padding:5px 10px;font-size:11px;font-weight:600;cursor:pointer">' + itx('deleteLbl') + '</button>';
    h += '</div>';
    h += '</div>';
    h += '</div></div>';
  }
  return h;
}

function renderInvoicesPage() {
  var page = document.getElementById('invoicesPage');
  if(!page) return;

  var h = '<div style="padding:16px 16px 120px;position:relative">';
  h += '<div style="font-size:20px;font-weight:700;margin-bottom:14px">' + itx('pageTitle') + '</div>';
  h += '<div style="display:flex;gap:8px;margin-bottom:16px">';
  h += '<button id="invtab_issued" style="flex:1;padding:8px 0;border:none;border-radius:20px;font-size:13px;font-weight:600;cursor:pointer;background:var(--primary);color:#fff">' + itx('issued') + '</button>';
  h += '<button id="invtab_receipts" style="flex:1;padding:8px 0;border:none;border-radius:20px;font-size:13px;font-weight:600;cursor:pointer;background:var(--card);color:var(--text)">' + itx('receiptsTab') + '</button>';
  h += '<button id="invtab_received" style="flex:1;padding:8px 0;border:none;border-radius:20px;font-size:13px;font-weight:600;cursor:pointer;background:var(--card);color:var(--text)">' + itx('received') + '</button>';
  h += '</div>';
  h += '<div id="invlist_issued">' + _renderInvoiceList(state.issuedInvoices, true, 'deleteIssuedInvoice', 'issued') + '</div>';
  h += '<div id="invlist_receipts" style="display:none">' + _renderInvoiceList(state.receipts, true, 'deleteReceipt', 'receipts') + '</div>';
  h += '<div id="invlist_received" style="display:none">' + _renderInvoiceList(state.receivedInvoices, false, 'deleteReceivedInvoice', 'received') + '</div>';
  h += '<button id="inv_fab" style="position:fixed;bottom:90px;right:20px;width:52px;height:52px;border-radius:50%;background:var(--primary);color:#fff;font-size:26px;border:none;box-shadow:0 4px 16px rgba(0,0,0,0.18);cursor:pointer;z-index:100;display:flex;align-items:center;justify-content:center;line-height:1">+</button>';
  h += '</div>';
  page.innerHTML = h;

  document.getElementById('invtab_issued').onclick = function(){ switchInvoiceTab('issued'); };
  document.getElementById('invtab_receipts').onclick = function(){ switchInvoiceTab('receipts'); };
  document.getElementById('invtab_received').onclick = function(){ switchInvoiceTab('received'); };

  var activeTab = _activeInvoiceTab || 'issued';
  switchInvoiceTab(activeTab);

  var issuedLen = state.issuedInvoices.length;
  for(var ii=0;ii<issuedLen;ii++) {
    (function(idx){
      var vb = document.getElementById('invview_issued_'+idx);
      if(vb) vb.onclick = function(){ printInvoice(state.issuedInvoices[idx],'issued'); };
      var pb = document.getElementById('invpdf_issued_'+idx);
      if(pb) pb.onclick = function(){ downloadInvoicePDF(state.issuedInvoices[idx],'issued'); };
      var db = document.getElementById('invdel_issued_'+idx);
      if(db) db.onclick = function(){ deleteIssuedInvoice(idx); };
      var tb = document.getElementById('invtoggle_issued_'+idx);
      if(tb) tb.onclick = function(){ toggleInvoiceStatus(idx, 'issued'); };
    })(ii);
  }
  var recLen = state.receipts.length;
  for(var ri=0;ri<recLen;ri++) {
    (function(idx){
      var vb = document.getElementById('invview_receipts_'+idx);
      if(vb) vb.onclick = function(){ printInvoice(state.receipts[idx],'receipt'); };
      var pb = document.getElementById('invpdf_receipts_'+idx);
      if(pb) pb.onclick = function(){ downloadInvoicePDF(state.receipts[idx],'receipt'); };
      var db = document.getElementById('invdel_receipts_'+idx);
      if(db) db.onclick = function(){ deleteReceipt(idx); };
      var tb = document.getElementById('invtoggle_receipts_'+idx);
      if(tb) tb.onclick = function(){ toggleInvoiceStatus(idx, 'receipts'); };
    })(ri);
  }
  var rvLen = state.receivedInvoices.length;
  for(var rvi=0;rvi<rvLen;rvi++) {
    (function(idx){
      var vb = document.getElementById('invview_received_'+idx);
      if(vb) vb.onclick = function(){ printInvoice(state.receivedInvoices[idx],'received'); };
      var pb = document.getElementById('invpdf_received_'+idx);
      if(pb) pb.onclick = function(){ downloadInvoicePDF(state.receivedInvoices[idx],'received'); };
      var db = document.getElementById('invdel_received_'+idx);
      if(db) db.onclick = function(){ deleteReceivedInvoice(idx); };
      var tb = document.getElementById('invtoggle_received_'+idx);
      if(tb) tb.onclick = function(){ toggleReceivedInvoiceStatus(idx); };
    })(rvi);
  }
}

async function deleteIssuedInvoice(idx) {
  if(!(await confirmAsync(DELETE_CONFIRM_TITLE[state.lang]||DELETE_CONFIRM_TITLE.en, itx('confirmDeleteInv')))) return;
  state.issuedInvoices.splice(idx,1);
  save(); renderInvoicesPage();
}
async function deleteReceipt(idx) {
  if(!(await confirmAsync(DELETE_CONFIRM_TITLE[state.lang]||DELETE_CONFIRM_TITLE.en, itx('confirmDeleteRec')))) return;
  state.receipts.splice(idx,1);
  save(); renderInvoicesPage();
}
async function deleteReceivedInvoice(idx) {
  if(!(await confirmAsync(DELETE_CONFIRM_TITLE[state.lang]||DELETE_CONFIRM_TITLE.en, itx('confirmDeleteInv')))) return;
  state.receivedInvoices.splice(idx,1);
  save(); renderInvoicesPage();
}

// Books the income a sales invoice represents. Guarded by inv.incomeTxId so an
// invoice can never be booked twice, whichever basis it was booked under.
function bookInvoiceIncome(inv, bookDate) {
  if(inv.incomeTxId) return;
  var items = inv.items || [];
  var vatRate = inv.vatRate || 0;
  var groups = {};
  var order = [];
  items.forEach(function(it){
    var cat = it.category || 'Sales';
    if(!groups[cat]) { groups[cat] = {names: [], amount: 0}; order.push(cat); }
    if(it.desc) groups[cat].names.push(it.desc);
    groups[cat].amount += (it.sub || (it.qty * it.price) || 0);
  });
  if(!order.length) { order.push('Sales'); groups.Sales = {names: [], amount: inv.total || 0}; }

  var firstTxId = null;
  order.forEach(function(cat, gi){
    var g = groups[cat];
    var txId = Date.now() + gi;
    if(firstTxId === null) firstTxId = txId;
    state.transactions.push({
      id: txId,
      name: g.names.join(', ') || (inv.number || itx('newInvoice')),
      amount: g.amount * (1 + vatRate / 100),
      type: 'income',
      category: cat,
      date: bookDate || today(),
      invoice: null,
      invoiceName: null,
      clientId: inv.clientId || null,
      clientName: inv.clientName || null,
      supplierId: null,
      supplierName: null,
      invoiceRef: inv.number || null,
    });
  });
  inv.incomeTxId = firstTxId;
}

// Called when an invoice is actually paid: books the income if it is not on the
// books yet (Ist-Besteuerung) and issues the payment receipt either way.
function handleInvoicePaid(inv) {
  bookInvoiceIncome(inv, today());
  if(!inv.autoReceiptId) {
    var items = inv.items || [];
    var receiptId = Date.now() + 1;
    state.receipts.push({
      id: receiptId,
      number: 'REC-' + receiptId,
      issueDate: today(),
      items: items,
      vatRate: inv.vatRate,
      notes: inv.notes,
      subtotal: inv.subtotal,
      vatAmount: inv.vatAmount,
      total: inv.total,
      status: 'Paid',
      currency: inv.currency || state.currency,
      clientId: inv.clientId || null,
      clientName: inv.clientName || null,
      paymentMethod: state.bankIban ? 'Bank Transfer' : 'Cash',
      category: (items[0] && items[0].category) || 'Sales',
      sourceInvoiceId: inv.id,
    });
    inv.autoReceiptId = receiptId;
  }
}

function toggleInvoiceStatus(idx, listType) {
  var list = listType === 'receipts' ? state.receipts : state.issuedInvoices;
  var inv = list[idx];
  if(!inv) return;
  var becamePaid = (inv.status === 'Pending' || inv.status === 'Overdue');
  inv.status = becamePaid ? 'Paid' : 'Pending';
  if(becamePaid && listType === 'issued') handleInvoicePaid(inv);
  save();
  renderInvoicesPage();
}

function handleReceivedInvoicePaid(inv) {
  if(inv.expenseTxId) return;
  var rcvLbl = {en:'Received Invoice', ar:'فاتورة واردة', de:'Eingangsrechnung'}[state.lang] || 'Received Invoice';
  var txDesc = (inv.number ? rcvLbl + ' ' + inv.number : rcvLbl);
  var txId = Date.now();
  state.transactions.push({
    id: txId,
    name: txDesc,
    amount: inv.total || 0,
    type: 'expense',
    category: 'supplier',
    date: today(),
    supplierId: inv.supplierId || null,
    supplierName: inv.supplierName || null,
    invoiceRef: inv.supplierInvNum || inv.number || null,
    hasInvoice: true,
  });
  inv.expenseTxId = txId;
}

function toggleReceivedInvoiceStatus(idx) {
  var inv = state.receivedInvoices[idx];
  if(!inv) return;
  var becamePaid = (inv.status === 'Pending' || inv.status === 'Overdue');
  inv.status = becamePaid ? 'Paid' : 'Pending';
  if(becamePaid) handleReceivedInvoicePaid(inv);
  save();
  renderInvoicesPage();
}

// The invoice form picks its client from Contacts: every non-government contact is
// mirrored into state.clients (same id) so printing/PDF keep working unchanged.
function syncContactsAsClients() {
  state.clients = state.clients || [];
  var have = {}, added = false;
  state.clients.forEach(function(c) { have[c.id] = 1; });
  (state.contacts || []).forEach(function(c) {
    if(!c || c.type === 'government' || have[c.id]) return;
    state.clients.push({id: c.id, name: c.name, company: c.type === 'company' ? c.name : '', phone: c.phone || '', email: c.email || '', country: '', address: '', notes: c.notes || '', since: ''});
    added = true;
  });
  if(added) save();
}

function _buildInvoiceOverlay(titleText, numberPrefix, extraFields, saveFunc, type) {
  if(type === 'issued' || type === 'receipt') syncContactsAsClients();
  var existing = document.getElementById('inv_overlay');
  if(existing) existing.parentNode.removeChild(existing);

  var todayVal = today();
  var invNum = numberPrefix + Date.now();
  var clientOptions = '';
  if(type === 'issued' || type === 'receipt') {
    var noCliMsg = {en:'No clients yet — add one in Contacts', ar:'لا يوجد عملاء بعد — أضف واحد من جهات الاتصال', de:'Noch keine Kunden — in Kontakte hinzufügen'}[state.lang] || 'No clients yet — add one in Contacts';
    var selCliMsg = {en:'Select client', ar:'اختر العميل', de:'Kunde wählen'}[state.lang] || 'Select client';
    if(!state.clients || !state.clients.length) {
      clientOptions = '<option value="">' + noCliMsg + '</option>';
    } else {
      clientOptions = '<option value="">— ' + selCliMsg + ' —</option>';
      for(var ci=0;ci<state.clients.length;ci++) {
        clientOptions += '<option value="' + state.clients[ci].id + '">' + escHtml(state.clients[ci].name) + '</option>';
      }
    }
  }

  var ov = document.createElement('div');
  ov.id = 'inv_overlay';
  ov.style.cssText = 'position:fixed;inset:0;z-index:9999;background:var(--bg);overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch';

  var html = '';
  html += '<div style="position:sticky;top:0;z-index:10;background:var(--primary);padding:14px 16px;display:flex;align-items:center;gap:12px">';
  html += '<button id="invov_back" style="background:transparent;border:none;color:#fff;font-size:18px;cursor:pointer;padding:0 8px 0 0">&#8592; Back</button>';
  html += '<div style="font-size:17px;font-weight:700;color:#fff">' + titleText + '</div>';
  html += '</div>';

  html += '<div style="padding:16px">';

  if(type === 'issued' || type === 'receipt') {
    var invLang = state.lang;
    var cliFieldLbl = {en:'Client', ar:'العميل', de:'Kunde'}[invLang] || 'Client';
    html += '<div style="margin-bottom:12px"><label style="font-size:13px;font-weight:600;display:block;margin-bottom:4px">' + cliFieldLbl + '</label>';
    html += '<select id="inv_client" style="width:100%;padding:10px;border-radius:10px;border:1px solid var(--border);background:var(--bg);color:var(--text);font-size:14px">' + clientOptions + '</select></div>';
  } else {
    var lang = state.lang;
    var supFieldLbl = {en:'Supplier', ar:'المورد', de:'Lieferant'}[lang] || 'Supplier';
    var supInvLbl = {en:'Supplier Invoice #', ar:'رقم فاتورة المورد', de:'Lieferanten-Rechnungs-Nr.'}[lang] || 'Supplier Invoice #';
    var supInvPh = {en:'Supplier invoice number', ar:'رقم الفاتورة', de:'Rechnungsnummer'}[lang] || 'Supplier invoice number';
    var addSupLnk = {en:'+ Add Supplier', ar:'+ إضافة مورد', de:'+ Lieferant hinzufügen'}[lang] || '+ Add Supplier';
    html += '<div style="margin-bottom:12px"><label style="font-size:13px;font-weight:600;display:block;margin-bottom:4px">' + supFieldLbl + '</label>';
    var supList = state.suppliers || [];
    if(!supList.length) {
      var noSupMsg = {en:'No suppliers yet — add from Suppliers page', ar:'لا يوجد موردون بعد — أضف من صفحة الموردين', de:'Noch keine Lieferanten — füge über die Lieferantenseite hinzu'}[lang] || 'No suppliers yet — add from Suppliers page';
      html += '<div style="padding:10px;border-radius:10px;border:1px solid var(--border);background:var(--bg);color:var(--text3);font-size:13px;margin-bottom:6px">' + noSupMsg + '</div>';
      html += '<input type="hidden" id="inv_supplier" value="">';
    } else {
      html += '<select id="inv_supplier" style="width:100%;padding:10px;border-radius:10px;border:1px solid var(--border);background:var(--bg);color:var(--text);font-size:14px;box-sizing:border-box;margin-bottom:6px">';
      html += '<option value="">— ' + ({en:'Select supplier', ar:'اختر المورد', de:'Lieferant wählen'}[lang] || 'Select supplier') + ' —</option>';
      for(var si = 0; si < supList.length; si++) {
        html += '<option value="' + supList[si].id + '">' + escHtml(supList[si].name) + '</option>';
      }
      html += '</select>';
    }
    html += '<span onclick="var ov=document.getElementById(\'inv_overlay\');if(ov)ov.parentNode.removeChild(ov);showNav(\'suppliers\');" style="font-size:12px;color:var(--primary);cursor:pointer;display:inline-block;margin-bottom:6px">' + addSupLnk + '</span></div>';
    html += '<div style="margin-bottom:12px"><label style="font-size:13px;font-weight:600;display:block;margin-bottom:4px">' + supInvLbl + '</label>';
    html += '<input type="text" id="inv_suppnum" placeholder="' + supInvPh + '" style="width:100%;padding:10px;border-radius:10px;border:1px solid var(--border);background:var(--bg);color:var(--text);font-size:14px;box-sizing:border-box"></div>';
  }

  html += '<div style="margin-bottom:12px"><label style="font-size:13px;font-weight:600;display:block;margin-bottom:4px">' + itx('invoiceNumLbl') + '</label>';
  html += '<input type="text" id="inv_number" value="' + invNum + '" style="width:100%;padding:10px;border-radius:10px;border:1px solid var(--border);background:var(--bg);color:var(--text);font-size:14px;box-sizing:border-box"></div>';

  html += '<div style="display:flex;gap:10px;margin-bottom:12px">';
  html += '<div style="flex:1"><label style="font-size:13px;font-weight:600;display:block;margin-bottom:4px">' + itx('issueDateLbl') + '</label>';
  html += '<div class="date-fix-wrap" style="height:40px;margin-bottom:0"><input type="date" id="inv_issue" value="' + todayVal + '" style="position:absolute;inset:0;width:100%;height:100%;padding:10px;border-radius:10px;border:1px solid var(--border);background:var(--bg);color:var(--text);font-size:14px;box-sizing:border-box"></div></div>';
  if(type !== 'receipt') {
    html += '<div style="flex:1"><label style="font-size:13px;font-weight:600;display:block;margin-bottom:4px">' + itx('dueDateLbl') + '</label>';
    html += '<div class="date-fix-wrap" style="height:40px;margin-bottom:0"><input type="date" id="inv_due" style="position:absolute;inset:0;width:100%;height:100%;padding:10px;border-radius:10px;border:1px solid var(--border);background:var(--bg);color:var(--text);font-size:14px;box-sizing:border-box"></div></div>';
  }
  html += '</div>';

  if(extraFields) html += extraFields;

  html += '<div style="margin-bottom:12px"><div style="font-size:13px;font-weight:700;margin-bottom:8px">' + itx('lineItems') + '</div>';
  html += '<div id="inv_items_wrap">';
  html += _buildLineItemRow(0, type);
  html += '</div>';
  html += '<button id="inv_add_item" style="width:100%;padding:8px;border-radius:10px;border:2px dashed var(--border);background:transparent;color:var(--primary);font-size:13px;font-weight:600;cursor:pointer;margin-top:6px">' + itx('addItem') + '</button></div>';

  html += '<div style="margin-bottom:12px"><label style="font-size:13px;font-weight:600;display:block;margin-bottom:4px">' + itx('vatLbl') + '</label>';
  html += '<select id="inv_vat" style="width:100%;padding:10px;border-radius:10px;border:1px solid var(--border);background:var(--bg);color:var(--text);font-size:14px">';
  html += '<option value="0">0%</option><option value="10">10%</option><option value="13">13%</option><option value="20">20%</option>';
  html += '</select></div>';

  html += '<div style="margin-bottom:12px"><label style="font-size:13px;font-weight:600;display:block;margin-bottom:4px">' + itx('notesLbl') + '</label>';
  html += '<textarea id="inv_notes" rows="3" placeholder="' + itx('notesPh') + '" style="width:100%;padding:10px;border-radius:10px;border:1px solid var(--border);background:var(--bg);color:var(--text);font-size:14px;box-sizing:border-box;resize:vertical"></textarea></div>';

  if(type === 'issued' || type === 'received') {
    html += '<div style="margin-bottom:16px"><div style="font-size:13px;font-weight:600;margin-bottom:8px">' + itx('statusLbl') + '</div>';
    html += '<div style="display:flex;gap:8px">';
    html += '<button id="inv_status_pending" onclick="setInvStatus(\'Pending\')" style="flex:1;padding:10px;border-radius:10px;border:2px solid var(--primary);background:var(--primary);color:#fff;font-size:13px;font-weight:600;cursor:pointer">' + itx('pending') + '</button>';
    html += '<button id="inv_status_paid" onclick="setInvStatus(\'Paid\')" style="flex:1;padding:10px;border-radius:10px;border:2px solid var(--border);background:var(--card);color:var(--text);font-size:13px;font-weight:600;cursor:pointer">' + itx('paid') + '</button>';
    html += '</div></div>';
  }

  html += '<div style="background:var(--card);border-radius:12px;padding:14px;margin-bottom:20px">';
  html += '<div style="display:flex;justify-content:space-between;margin-bottom:6px"><span style="font-size:13px;color:var(--text3)">' + itx('subtotalLbl') + '</span><span id="inv_subtotal" style="font-size:13px;font-weight:600">0.00</span></div>';
  html += '<div style="display:flex;justify-content:space-between;margin-bottom:6px"><span style="font-size:13px;color:var(--text3)">' + itx('vatLbl') + '</span><span id="inv_vatamt" style="font-size:13px;font-weight:600">0.00</span></div>';
  html += '<div style="display:flex;justify-content:space-between;border-top:1px solid var(--border);padding-top:8px;margin-top:4px"><span style="font-size:15px;font-weight:700">' + itx('totalLbl') + '</span><span id="inv_total_disp" style="font-size:15px;font-weight:700;color:var(--primary)">0.00</span></div>';
  html += '</div>';

  html += '<div style="display:flex;gap:10px;padding-bottom:40px">';
  html += '<button id="invov_save" style="flex:1;padding:14px;border-radius:12px;border:none;background:var(--primary);color:#fff;font-size:15px;font-weight:700;cursor:pointer">' + itx('saveLbl') + '</button>';
  if(type !== 'receipt') {
    html += '<button id="invov_print" style="flex:1;padding:14px;border-radius:12px;border:1px solid var(--primary);background:transparent;color:var(--primary);font-size:15px;font-weight:700;cursor:pointer">' + itx('printPreview') + '</button>';
    html += '<button id="invov_pdf" style="flex:1;padding:14px;border-radius:12px;border:1px solid var(--primary);background:transparent;color:var(--primary);font-size:15px;font-weight:700;cursor:pointer">' + ({en:'Download PDF', ar:'تحميل PDF', de:'PDF herunterladen'}[state.lang] || 'Download PDF') + '</button>';
  }
  html += '</div>';
  html += '</div>';

  ov.innerHTML = html;
  document.body.appendChild(ov);

  window._invStatus = 'Pending';
  window._invItemCount = 1;

  document.getElementById('invov_back').onclick = function(){ ov.parentNode.removeChild(ov); };
  document.getElementById('inv_add_item').onclick = function(){
    var wrap = document.getElementById('inv_items_wrap');
    var idx = window._invItemCount;
    window._invItemCount++;
    var row = document.createElement('div');
    row.id = 'inv_item_' + idx;
    row.innerHTML = _buildLineItemRow(idx, type);
    wrap.appendChild(row);
    _attachRowListeners(idx);
    _recalcInvoiceTotals();
  };
  document.getElementById('inv_vat').onchange = function(){ _recalcInvoiceTotals(); };
  _attachRowListeners(0);

  document.getElementById('invov_save').onclick = function(){ saveFunc(); };
  if(type !== 'receipt') {
    var ppBtn = document.getElementById('invov_print');
    if(ppBtn) ppBtn.onclick = function(){ printInvoice(_collectInvoiceFormData(type), type); };
    var pdfBtn = document.getElementById('invov_pdf');
    if(pdfBtn) pdfBtn.onclick = function(){ _recalcInvoiceTotals(); downloadInvoicePDF(_collectInvoiceFormData(type), type); };
  }
  _recalcInvoiceTotals();
}

function _buildLineItemRow(idx, type) {
  var base = 'style="padding:8px;border-radius:8px;border:1px solid var(--border);background:var(--bg);color:var(--text);font-size:13px;box-sizing:border-box"';
  if(type === 'issued') {
    var catOptions = '';
    CATS.income.forEach(function(c){ catOptions += '<option value="' + c + '">' + tc(c) + '</option>'; });
    return '<div id="inv_item_' + idx + '" style="border:1px solid var(--border);border-radius:10px;padding:8px;margin-bottom:8px">' +
      '<input type="text" id="inv_desc_' + idx + '" placeholder="' + itx('descPh') + '" style="width:100%;padding:8px;border-radius:8px;border:1px solid var(--border);background:var(--bg);color:var(--text);font-size:13px;box-sizing:border-box;margin-bottom:6px">' +
      '<div style="display:grid;grid-template-columns:1fr 60px 80px 70px 30px;gap:6px;align-items:center">' +
      '<select id="inv_cat_' + idx + '" ' + base + '>' + catOptions + '</select>' +
      '<input type="number" id="inv_qty_' + idx + '" placeholder="' + itx('qtyPh') + '" value="1" min="0" ' + base + '>' +
      '<input type="number" id="inv_price_' + idx + '" placeholder="' + itx('pricePh') + '" min="0" ' + base + '>' +
      '<span id="inv_sub_' + idx + '" style="font-size:12px;font-weight:600;text-align:right">0.00</span>' +
      '<button onclick="removeInvRow(' + idx + ')" style="background:#ff4444;color:#fff;border:none;border-radius:6px;padding:4px 6px;font-size:13px;cursor:pointer">\xD7</button>' +
      '</div></div>';
  }
  return '<div id="inv_item_' + idx + '" style="display:grid;grid-template-columns:1fr 60px 80px 70px 30px;gap:6px;margin-bottom:6px;align-items:center">' +
    '<input type="text" id="inv_desc_' + idx + '" placeholder="' + itx('descPh') + '" ' + base + '>' +
    '<input type="number" id="inv_qty_' + idx + '" placeholder="' + itx('qtyPh') + '" value="1" min="0" ' + base + '>' +
    '<input type="number" id="inv_price_' + idx + '" placeholder="' + itx('pricePh') + '" min="0" ' + base + '>' +
    '<span id="inv_sub_' + idx + '" style="font-size:12px;font-weight:600;text-align:right">0.00</span>' +
    '<button onclick="removeInvRow(' + idx + ')" style="background:#ff4444;color:#fff;border:none;border-radius:6px;padding:4px 6px;font-size:13px;cursor:pointer">\xD7</button>' +
    '</div>';
}

function _attachRowListeners(idx) {
  var qEl = document.getElementById('inv_qty_' + idx);
  var pEl = document.getElementById('inv_price_' + idx);
  if(qEl) qEl.oninput = function(){ _recalcInvoiceTotals(); };
  if(pEl) pEl.oninput = function(){ _recalcInvoiceTotals(); };
}

function removeInvRow(idx) {
  var row = document.getElementById('inv_item_' + idx);
  if(row) row.parentNode.removeChild(row);
  _recalcInvoiceTotals();
}

function _recalcInvoiceTotals() {
  var subtotal = 0;
  for(var i=0;i<(window._invItemCount||1)+20;i++) {
    var qEl = document.getElementById('inv_qty_'+i);
    var pEl = document.getElementById('inv_price_'+i);
    var sEl = document.getElementById('inv_sub_'+i);
    if(!qEl || !pEl) continue;
    var row = document.getElementById('inv_item_'+i);
    if(!row || row.style.display==='none') continue;
    var sub = (parseFloat(qEl.value)||0) * (parseFloat(pEl.value)||0);
    subtotal += sub;
    if(sEl) sEl.textContent = sub.toFixed(2);
  }
  var vatRate = parseFloat((document.getElementById('inv_vat')||{}).value||0);
  var vatAmt = subtotal * vatRate / 100;
  var total = subtotal + vatAmt;
  var cur = state.currency;
  var stEl = document.getElementById('inv_subtotal');
  var vaEl = document.getElementById('inv_vatamt');
  var toEl = document.getElementById('inv_total_disp');
  if(stEl) stEl.textContent = cur + subtotal.toFixed(2);
  if(vaEl) vaEl.textContent = cur + vatAmt.toFixed(2) + ' (' + vatRate + '%)';
  if(toEl) toEl.textContent = cur + total.toFixed(2);
  window._invComputedTotal = total;
  window._invComputedSubtotal = subtotal;
  window._invComputedVat = vatAmt;
}

function setInvStatus(s) {
  window._invStatus = s;
  var pBtn = document.getElementById('inv_status_pending');
  var dBtn = document.getElementById('inv_status_paid');
  if(!pBtn||!dBtn) return;
  if(s==='Pending') {
    pBtn.style.background='var(--primary)'; pBtn.style.color='#fff'; pBtn.style.borderColor='var(--primary)';
    dBtn.style.background='var(--card)'; dBtn.style.color='var(--text)'; dBtn.style.borderColor='var(--border)';
  } else {
    dBtn.style.background='var(--primary)'; dBtn.style.color='#fff'; dBtn.style.borderColor='var(--primary)';
    pBtn.style.background='var(--card)'; pBtn.style.color='var(--text)'; pBtn.style.borderColor='var(--border)';
  }
}

function _collectInvoiceFormData(type) {
  var items = [];
  for(var i=0;i<(window._invItemCount||1)+20;i++) {
    var dEl = document.getElementById('inv_desc_'+i);
    var qEl = document.getElementById('inv_qty_'+i);
    var pEl = document.getElementById('inv_price_'+i);
    if(!dEl||!qEl||!pEl) continue;
    var row = document.getElementById('inv_item_'+i);
    if(!row) continue;
    var desc = dEl.value.trim();
    var qty = parseFloat(qEl.value)||0;
    var price = parseFloat(pEl.value)||0;
    var catEl = document.getElementById('inv_cat_'+i);
    var itemCategory = catEl ? catEl.value : 'Sales';
    if(desc||qty||price) items.push({desc:desc, qty:qty, price:price, sub:(qty*price), category:itemCategory});
  }
  var vatRate = parseFloat((document.getElementById('inv_vat')||{}).value||0);
  var obj = {
    id: Date.now(),
    number: (document.getElementById('inv_number')||{}).value||'',
    issueDate: (document.getElementById('inv_issue')||{}).value||'',
    dueDate: (document.getElementById('inv_due')||{}).value||'',
    items: items,
    vatRate: vatRate,
    notes: (document.getElementById('inv_notes')||{}).value||'',
    subtotal: window._invComputedSubtotal||0,
    vatAmount: window._invComputedVat||0,
    total: window._invComputedTotal||0,
    status: type==='receipt' ? 'Paid' : (window._invStatus||'Pending'),
    currency: state.currency,
  };
  if(type==='issued'||type==='receipt') {
    var invCliEl = document.getElementById('inv_client');
    var invCliVal = invCliEl ? invCliEl.value : '';
    var invCliId = parseInt(invCliVal, 10);
    var invCliName = '';
    if(invCliId) {
      var invCliList = state.clients || [];
      for(var ici = 0; ici < invCliList.length; ici++) {
        if(invCliList[ici].id === invCliId) { invCliName = invCliList[ici].name; break; }
      }
    }
    obj.clientId = invCliId || null;
    obj.clientName = invCliName || invCliVal;
  } else {
    var invSupEl = document.getElementById('inv_supplier');
    var invSupVal = invSupEl ? invSupEl.value : '';
    var invSupId = parseInt(invSupVal, 10);
    var invSupName = '';
    if(invSupId) {
      var invSupList = state.suppliers || [];
      for(var isi = 0; isi < invSupList.length; isi++) {
        if(invSupList[isi].id === invSupId) { invSupName = invSupList[isi].name; break; }
      }
    }
    obj.supplierId = invSupId || null;
    obj.supplierName = invSupName || invSupVal;
    obj.supplierInvNum = (document.getElementById('inv_suppnum')||{}).value||'';
  }
  if(type==='receipt') {
    obj.paymentMethod = (document.getElementById('inv_paymethod')||{}).value||'Cash';
  }
  return obj;
}

function openIssuedInvoiceForm() {
  _buildInvoiceOverlay(itx('newInvoice'),'INV-',null,saveIssuedInvoice,'issued');
}

function openReceiptForm() {
  var extra = '<div style="margin-bottom:12px"><label style="font-size:13px;font-weight:600;display:block;margin-bottom:4px">' + itx('paymentMethod') + '</label>' +
    '<select id="inv_paymethod" style="width:100%;padding:10px;border-radius:10px;border:1px solid var(--border);background:var(--bg);color:var(--text);font-size:14px">' +
    '<option value="Cash">' + itx('cashOpt') + '</option><option value="Bank Transfer">' + itx('bankTransferOpt') + '</option><option value="Card">' + itx('cardOpt') + '</option><option value="Other">' + itx('otherOpt') + '</option>' +
    '</select></div>';
  _buildInvoiceOverlay(itx('newReceipt'),'REC-',extra,saveReceipt,'receipt');
}

function openReceivedInvoiceForm() {
  _buildInvoiceOverlay(itx('newReceived'),'RINV-',null,saveReceivedInvoice,'received');
}

function saveIssuedInvoice() {
  _recalcInvoiceTotals();
  var inv = _collectInvoiceFormData('issued');
  state.issuedInvoices.push(inv);
  // Soll-Besteuerung: the income belongs to the invoice date, not the payment.
  // In the new shell there is no invoices list to mark an invoice paid later, so an invoice
  // created from the month screen counts as income on its issue date (bookInvoiceIncome is
  // guarded by incomeTxId, so a later payment can never double-count it).
  if(state.vatBasis === 'soll' || document.body.classList.contains('art')) bookInvoiceIncome(inv, inv.issueDate);
  if(inv.status === 'Paid') handleInvoicePaid(inv);
  save();
  _activeInvoiceTab = 'issued';
  var ov = document.getElementById('inv_overlay');
  if(ov) ov.parentNode.removeChild(ov);
  renderInvoicesPage();
  if(document.body.classList.contains('art')) {
    var iy = parseInt((inv.issueDate || '').substring(0, 4), 10), im = parseInt((inv.issueDate || '').substring(5, 7), 10) - 1;
    if(iy && im >= 0) { state.year = iy; state.month = im; }
    state.txTab = 'income';
    state.homeView = 'month';
    showNav('home');
    openMonthDetail(state.month);
  }
}

function saveReceipt() {
  _recalcInvoiceTotals();
  var inv = _collectInvoiceFormData('receipt');
  state.receipts.push(inv);
  save();
  _activeInvoiceTab = 'receipts';
  var ov = document.getElementById('inv_overlay');
  if(ov) ov.parentNode.removeChild(ov);
  renderInvoicesPage();
}

function saveReceivedInvoice() {
  _recalcInvoiceTotals();
  var inv = _collectInvoiceFormData('received');
  state.receivedInvoices.push(inv);
  if(inv.status === 'Paid') handleReceivedInvoicePaid(inv);
  save();
  _activeInvoiceTab = 'received';
  var ov = document.getElementById('inv_overlay');
  if(ov) ov.parentNode.removeChild(ov);
  renderInvoicesPage();
  renderHome();
}

var PRINT_L = {
  invoice:        {en:'INVOICE', ar:'فاتورة', de:'RECHNUNG'},
  receipt:        {en:'RECEIPT', ar:'إيصال', de:'QUITTUNG'},
  receivedInvoice:{en:'RECEIVED INVOICE', ar:'فاتورة واردة', de:'EINGANGSRECHNUNG'},
  billTo:         {en:'Bill To', ar:'إلى', de:'Rechnung an'},
  fromSupplier:   {en:'From (Supplier)', ar:'من (المورد)', de:'Von (Lieferant)'},
  description:    {en:'Description', ar:'الوصف', de:'Beschreibung'},
  qty:            {en:'Qty', ar:'الكمية', de:'Menge'},
  unitPrice:      {en:'Unit Price', ar:'سعر الوحدة', de:'Einzelpreis'},
  subtotal:       {en:'Subtotal', ar:'المجموع الفرعي', de:'Zwischensumme'},
  total:          {en:'Total', ar:'الإجمالي', de:'Gesamt'},
  vat:            {en:'VAT', ar:'ضريبة القيمة المضافة', de:'MwSt.'},
  issueLbl:       {en:'Issue', ar:'تاريخ الإصدار', de:'Ausgestellt'},
  dueLbl:         {en:'Due', ar:'تاريخ الاستحقاق', de:'Fällig'},
  notes:          {en:'Notes', ar:'ملاحظات', de:'Notizen'},
  thanks:         {en:'Thank you for your business', ar:'شكراً لتعاملكم معنا', de:'Vielen Dank für Ihr Vertrauen'},
  paymentDetails: {en:'Payment Details', ar:'تفاصيل الدفع', de:'Zahlungsdetails'},
  bank:           {en:'Bank', ar:'البنك', de:'Bank'},
  iban:           {en:'IBAN', ar:'آيبان', de:'IBAN'},
  bic:            {en:'BIC', ar:'BIC', de:'BIC'},
  accountHolder:  {en:'Account Holder', ar:'صاحب الحساب', de:'Kontoinhaber'},
  printBtn:       {en:'Print', ar:'طباعة', de:'Drucken'},
  closeBtn:       {en:'Close', ar:'إغلاق', de:'Schließen'},
  supplierInvNum: {en:'Supplier Inv #', ar:'رقم فاتورة المورد', de:'Lieferanten-Rechnungs-Nr.'},
  paymentLbl:     {en:'Payment', ar:'الدفع', de:'Zahlung'},
  receiptTitle:   {en:'Receipt', ar:'إيصال', de:'Quittung'},
  invoiceNumber:  {en:'Invoice number', ar:'رقم الفاتورة', de:'Rechnungsnummer'},
  receiptNumber:  {en:'Receipt number', ar:'رقم الإيصال', de:'Belegnummer'},
  datePaid:       {en:'Date paid', ar:'تاريخ الدفع', de:'Zahlungsdatum'},
  billToLbl:      {en:'Bill to', ar:'إلى', de:'Rechnung an'},
  paidOn:         {en:'paid on', ar:'دُفع في', de:'bezahlt am'},
  taxCol:         {en:'Tax', ar:'الضريبة', de:'Steuer'},
  amountCol:      {en:'Amount', ar:'المبلغ', de:'Betrag'},
  totalExclTax:   {en:'Total excluding tax', ar:'الإجمالي بدون ضريبة', de:'Gesamt ohne MwSt.'},
  amountPaidLbl:  {en:'Amount paid', ar:'المبلغ المدفوع', de:'Bezahlter Betrag'},
  paymentHistory: {en:'Payment history', ar:'سجل الدفع', de:'Zahlungsverlauf'},
  paymentMethodCol:{en:'Payment method', ar:'طريقة الدفع', de:'Zahlungsmethode'},
  dateCol:        {en:'Date', ar:'التاريخ', de:'Datum'},
  pageFooter:     {en:'Page 1 of 1', ar:'صفحة 1 من 1', de:'Seite 1 von 1'},
};
// Invoice/receipt PDFs always render in German, regardless of the app's UI language.
function ptx(k) { return (PRINT_L[k] && PRINT_L[k].de) || (PRINT_L[k] && PRINT_L[k].en) || k; }
function ltrSpan(s) { return '<span dir="ltr" style="unicode-bidi:bidi-override">' + s + '</span>'; }

function buildInvoiceHTML(inv, type) {
  if(type === 'receipt') return buildProfessionalReceipt(inv);
  if(state.invoiceTemplate === 'modern') return buildModernInvoice(inv, type);
  return buildClassicInvoice(inv, type);
}

function formatDateLong(dateStr) {
  if(!dateStr) return '';
  var s = String(dateStr).substring(0,10);
  var d = new Date(s + 'T12:00:00');
  if(isNaN(d.getTime())) return s;
  var locale = 'de-DE';
  try { return d.toLocaleDateString(locale, {year:'numeric', month:'long', day:'numeric'}); }
  catch(e) { return s; }
}

function buildProfessionalReceipt(inv) {
  var cur = inv.currency || state.currency;
  var items = inv.items || [];
  var vatRate = inv.vatRate || 0;
  var bizName = state.businessName || 'Your Company Name';
  var bizAddress = state.businessAddress || '';
  var bizTaxId = state.businessTaxId || '';
  var bizPhone = state.businessPhone || '';
  var bizEmail = state.businessEmail || '';

  var sourceInv = null;
  if(inv.sourceInvoiceId) {
    var srcList = state.issuedInvoices || [];
    for(var si=0; si<srcList.length; si++) {
      if(srcList[si].id === inv.sourceInvoiceId) { sourceInv = srcList[si]; break; }
    }
  }
  var client = null;
  if(inv.clientId) {
    var cliList = state.clients || [];
    for(var ci=0; ci<cliList.length; ci++) {
      if(cliList[ci].id === inv.clientId) { client = cliList[ci]; break; }
    }
  }

  var paymentMethodLabel = itx('cashOpt');
  if(inv.paymentMethod === 'Bank Transfer') paymentMethodLabel = itx('bankTransferOpt');
  else if(inv.paymentMethod === 'Card') paymentMethodLabel = itx('cardOpt');
  else if(inv.paymentMethod === 'Other') paymentMethodLabel = itx('otherOpt');

  var metaRows = '';
  if(sourceInv) metaRows += '<div style="display:flex;gap:8px;font-size:12px;margin-bottom:2px"><span style="font-weight:700;width:120px;flex-shrink:0">' + ptx('invoiceNumber') + '</span><span>' + ltrSpan(sourceInv.number||'') + '</span></div>';
  metaRows += '<div style="display:flex;gap:8px;font-size:12px;margin-bottom:2px"><span style="font-weight:700;width:120px;flex-shrink:0">' + ptx('receiptNumber') + '</span><span>' + ltrSpan(inv.number||'') + '</span></div>';
  metaRows += '<div style="display:flex;gap:8px;font-size:12px"><span style="font-weight:700;width:120px;flex-shrink:0">' + ptx('datePaid') + '</span><span>' + formatDateLong(inv.issueDate) + '</span></div>';

  var billToLines = '';
  if(client) {
    if(client.company) billToLines += '<div>' + escHtml(client.company) + '</div>';
    if(client.address) billToLines += '<div>' + escHtml(client.address) + '</div>';
    if(client.country) billToLines += '<div>' + escHtml(client.country) + '</div>';
    if(client.email) billToLines += '<div>' + escHtml(client.email) + '</div>';
    if(client.phone) billToLines += '<div>' + escHtml(client.phone) + '</div>';
  }

  var itemRows = '';
  for(var i=0;i<items.length;i++) {
    itemRows += '<tr>' +
      '<td style="padding:10px 0;border-bottom:1px solid #e5e7eb;text-align:left;font-size:13px">' + (items[i].desc||'') + '</td>' +
      '<td style="padding:10px 0;border-bottom:1px solid #e5e7eb;text-align:center;font-size:13px">' + ltrSpan(items[i].qty||0) + '</td>' +
      '<td style="padding:10px 0;border-bottom:1px solid #e5e7eb;text-align:right;font-size:13px">' + ltrSpan(cur + parseFloat(items[i].price||0).toFixed(2)) + '</td>' +
      '<td style="padding:10px 0;border-bottom:1px solid #e5e7eb;text-align:right;font-size:13px">' + vatRate + '%</td>' +
      '<td style="padding:10px 0;border-bottom:1px solid #e5e7eb;text-align:right;font-size:13px">' + ltrSpan(cur + parseFloat(items[i].sub||0).toFixed(2)) + '</td>' +
      '</tr>';
  }

  var showBankBox = state.bankIban && inv.paymentMethod === 'Bank Transfer';
  var bankQrHtml = '';
  if(showBankBox) {
    bankQrHtml = '<div style="margin-top:20px;padding-top:16px;border-top:1px solid #e5e7eb;display:flex;justify-content:space-between;align-items:flex-start;gap:16px">' +
      '<div style="font-size:12px;color:#6b7280">' +
      '<div style="font-weight:700;color:#0f172a;margin-bottom:4px">' + ptx('paymentDetails') + '</div>' +
      (state.bankName ? '<div>' + ptx('bank') + ': ' + state.bankName + '</div>' : '') +
      '<div>' + ptx('iban') + ': ' + ltrSpan(state.bankIban) + '</div>' +
      (state.bankBic ? '<div>' + ptx('bic') + ': ' + ltrSpan(state.bankBic) + '</div>' : '') +
      '</div>' +
      '<div id="epc-qr-' + inv.id + '" style="width:100px;height:100px;flex-shrink:0"></div>' +
      '</div>';
  }

  var doc = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>' + ptx('receiptTitle') + ' ' + (inv.number||'') + '</title>' +
  '<style>' +
  'html,body{height:100%}' +
  'body{font-family:Arial,sans-serif;margin:0;color:#0f172a;background:#fff;box-sizing:border-box}' +
  '.no-print{display:flex;gap:10px;padding:16px 40px 0}' +
  '@media print{.no-print{display:none}@page{size:A4}}' +
  '</style></head><body>' +
  invoiceNoPrintBar() +
  '<div style="max-width:760px;margin:0 auto;padding:40px;display:flex;flex-direction:column;min-height:1043px;box-sizing:border-box">' +
  '<div style="flex:1">' +

  '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">' +
  '<div style="font-size:30px;font-weight:700">' + ptx('receiptTitle') + '</div>' +
  (state.businessLogo ? '<img src="' + state.businessLogo + '" style="height:216px;max-width:450px;object-fit:contain">' : '') +
  '</div>' +

  metaRows +

  '<div style="display:flex;justify-content:space-between;gap:24px;margin-top:24px;margin-bottom:24px">' +
  '<div style="font-size:13px;line-height:1.6">' +
  '<div style="font-weight:700;margin-bottom:2px">' + bizName + '</div>' +
  (bizAddress ? '<div>' + escHtml(bizAddress) + '</div>' : '') +
  (bizEmail ? '<div>' + escHtml(bizEmail) + '</div>' : '') +
  (bizPhone ? '<div>' + ltrSpan(escHtml(bizPhone)) + '</div>' : '') +
  (bizTaxId ? '<div>UID: ' + escHtml(bizTaxId) + '</div>' : '') +
  '</div>' +
  '<div style="font-size:13px;line-height:1.6;text-align:right">' +
  '<div style="font-weight:700;margin-bottom:2px">' + ptx('billToLbl') + '</div>' +
  '<div>' + (inv.clientName||'') + '</div>' +
  billToLines +
  '</div>' +
  '</div>' +

  '<div style="font-size:18px;font-weight:700;margin-bottom:4px">' + ltrSpan(cur + parseFloat(inv.total||0).toFixed(2)) + ' ' + ptx('paidOn') + ' ' + formatDateLong(inv.issueDate) + '</div>' +
  '<div style="font-size:12px;color:#6b7280;margin-bottom:20px">' + ptx('paymentLbl') + ': ' + paymentMethodLabel + '</div>' +

  '<table style="width:100%;border-collapse:collapse;margin-bottom:4px">' +
  '<thead><tr>' +
  '<th style="padding:8px 0;border-bottom:1px solid #0f172a;text-align:left;font-size:11px;color:#6b7280;text-transform:uppercase">' + ptx('description') + '</th>' +
  '<th style="padding:8px 0;border-bottom:1px solid #0f172a;text-align:center;font-size:11px;color:#6b7280;text-transform:uppercase">' + ptx('qty') + '</th>' +
  '<th style="padding:8px 0;border-bottom:1px solid #0f172a;text-align:right;font-size:11px;color:#6b7280;text-transform:uppercase">' + ptx('unitPrice') + '</th>' +
  '<th style="padding:8px 0;border-bottom:1px solid #0f172a;text-align:right;font-size:11px;color:#6b7280;text-transform:uppercase">' + ptx('taxCol') + '</th>' +
  '<th style="padding:8px 0;border-bottom:1px solid #0f172a;text-align:right;font-size:11px;color:#6b7280;text-transform:uppercase">' + ptx('amountCol') + '</th>' +
  '</tr></thead><tbody>' + itemRows + '</tbody></table>' +

  '<div style="display:flex;justify-content:flex-end;margin-bottom:20px">' +
  '<div style="width:280px">' +
  '<div style="display:flex;justify-content:space-between;padding:5px 0;font-size:13px"><span style="color:#6b7280">' + ptx('subtotal') + '</span><span>' + ltrSpan(cur + parseFloat(inv.subtotal||0).toFixed(2)) + '</span></div>' +
  '<div style="display:flex;justify-content:space-between;padding:5px 0;font-size:13px"><span style="color:#6b7280">' + ptx('totalExclTax') + '</span><span>' + ltrSpan(cur + parseFloat(inv.subtotal||0).toFixed(2)) + '</span></div>' +
  '<div style="display:flex;justify-content:space-between;padding:5px 0;font-size:13px"><span style="color:#6b7280">' + ptx('vat') + ' (' + vatRate + '% auf ' + ltrSpan(cur + parseFloat(inv.subtotal||0).toFixed(2)) + ')</span><span>' + ltrSpan(cur + parseFloat(inv.vatAmount||0).toFixed(2)) + '</span></div>' +
  '<div style="display:flex;justify-content:space-between;padding:5px 0;font-size:13px;border-top:1px solid #e5e7eb;margin-top:2px"><span style="color:#6b7280">' + ptx('total') + '</span><span>' + ltrSpan(cur + parseFloat(inv.total||0).toFixed(2)) + '</span></div>' +
  '<div style="display:flex;justify-content:space-between;padding:6px 0;font-size:14px;font-weight:700"><span>' + ptx('amountPaidLbl') + '</span><span>' + ltrSpan(cur + parseFloat(inv.total||0).toFixed(2)) + '</span></div>' +
  '</div></div>' +

  bankQrHtml +

  '<div style="font-size:16px;font-weight:700;margin-top:24px;margin-bottom:10px">' + ptx('paymentHistory') + '</div>' +
  '<table style="width:100%;border-collapse:collapse">' +
  '<thead><tr>' +
  '<th style="padding:8px 0;border-bottom:1px solid #0f172a;text-align:left;font-size:11px;color:#6b7280;text-transform:uppercase">' + ptx('paymentMethodCol') + '</th>' +
  '<th style="padding:8px 0;border-bottom:1px solid #0f172a;text-align:left;font-size:11px;color:#6b7280;text-transform:uppercase">' + ptx('dateCol') + '</th>' +
  '<th style="padding:8px 0;border-bottom:1px solid #0f172a;text-align:left;font-size:11px;color:#6b7280;text-transform:uppercase">' + ptx('amountPaidLbl') + '</th>' +
  '<th style="padding:8px 0;border-bottom:1px solid #0f172a;text-align:left;font-size:11px;color:#6b7280;text-transform:uppercase">' + ptx('receiptNumber') + '</th>' +
  '</tr></thead><tbody><tr>' +
  '<td style="padding:10px 0;font-size:13px">' + paymentMethodLabel + '</td>' +
  '<td style="padding:10px 0;font-size:13px">' + formatDateLong(inv.issueDate) + '</td>' +
  '<td style="padding:10px 0;font-size:13px">' + ltrSpan(cur + parseFloat(inv.total||0).toFixed(2)) + '</td>' +
  '<td style="padding:10px 0;font-size:13px">' + ltrSpan(inv.number||'') + '</td>' +
  '</tr></tbody></table>' +

  '</div>' +
  '<div style="border-top:1px solid #e5e7eb;margin-top:24px;padding-top:10px;text-align:right;font-size:11px;color:#9ca3af">' + ptx('pageFooter') + '</div>' +
  '</div>' +
  '</body></html>';

  return doc;
}

function buildClassicInvoice(inv, type) {
  var D = invDesign('classic');
  var isRTL = false; // invoice PDFs always render German/LTR, regardless of app language
  var dirAttr = isRTL ? 'rtl' : 'ltr';
  var alignStart = isRTL ? 'right' : 'left';
  var alignEnd = isRTL ? 'left' : 'right';
  var typeLabel = type==='issued' ? ptx('invoice') : type==='receipt' ? ptx('receipt') : ptx('receivedInvoice');
  var billLabel = type==='received' ? ptx('fromSupplier') : ptx('billTo');
  var partyName = inv.clientName || inv.supplierName || '';
  var cur = inv.currency || state.currency;
  var bizName = state.businessName || 'Your Company Name';
  var bizAddress = state.businessAddress || '';
  var bizTaxId = state.businessTaxId || '';
  var bizPhone = state.businessPhone || '';
  var bizEmail = state.businessEmail || '';
  var bizContactLine = [bizAddress, bizEmail, bizPhone, bizTaxId ? 'UID: ' + bizTaxId : ''].filter(Boolean).join('<br>');

  var itemRows = '';
  var items = inv.items || [];
  for(var i=0;i<items.length;i++) {
    var rowBg = (i%2===0) ? '#fff' : '#f8fafc';
    itemRows += '<tr style="background:' + rowBg + '">' +
      '<td style="padding:8px 10px;border:1px solid #e2e8f0;text-align:' + alignStart + '">' + (items[i].desc||'') + '</td>' +
      '<td style="padding:8px 10px;border:1px solid #e2e8f0;text-align:center">' + ltrSpan(items[i].qty||0) + '</td>' +
      '<td style="padding:8px 10px;border:1px solid #e2e8f0;text-align:' + alignEnd + '">' + ltrSpan(cur + parseFloat(items[i].price||0).toFixed(2)) + '</td>' +
      '<td style="padding:8px 10px;border:1px solid #e2e8f0;text-align:' + alignEnd + '">' + ltrSpan(cur + parseFloat(items[i].sub||0).toFixed(2)) + '</td>' +
      '</tr>';
  }

  var notesHtml = '';
  if(inv.notes) {
    notesHtml = '<div style="margin-top:24px"><div style="font-size:13px;font-weight:700;color:#374151;margin-bottom:6px">' + ptx('notes') + '</div>' +
      '<div style="font-size:13px;color:#6b7280;white-space:pre-wrap">' + inv.notes + '</div></div>';
  }

  var paymentMethodLabel = '';
  if(inv.paymentMethod === 'Cash') paymentMethodLabel = itx('cashOpt');
  else if(inv.paymentMethod === 'Bank Transfer') paymentMethodLabel = itx('bankTransferOpt');
  else if(inv.paymentMethod === 'Card') paymentMethodLabel = itx('cardOpt');
  else if(inv.paymentMethod === 'Other') paymentMethodLabel = itx('otherOpt');

  var showBankBox = state.bankIban && (type === 'issued' || (type === 'receipt' && inv.paymentMethod === 'Bank Transfer'));
  var bankBoxHtml = '';
  var qrHtml = '';
  if(showBankBox) {
    bankBoxHtml = '<div style="flex:1;font-size:12px;color:#475569;border:1px solid #e2e8f0;border-radius:8px;padding:12px;text-align:' + alignStart + '">' +
      '<div style="font-weight:700;margin-bottom:6px">' + ptx('paymentDetails') + '</div>' +
      (state.bankName ? '<div>' + ptx('bank') + ': ' + state.bankName + '</div>' : '') +
      (state.bankIban ? '<div>' + ptx('iban') + ': ' + ltrSpan(state.bankIban) + '</div>' : '') +
      (state.bankBic ? '<div>' + ptx('bic') + ': ' + ltrSpan(state.bankBic) + '</div>' : '') +
      (state.bankAccountHolder ? '<div>' + ptx('accountHolder') + ': ' + state.bankAccountHolder + '</div>' : '') +
      '</div>';
    qrHtml = '<div id="epc-qr-' + inv.id + '" style="width:120px;height:120px;flex-shrink:0"></div>';
  }

  var doc = '<!DOCTYPE html><html dir="' + dirAttr + '"><head><meta charset="utf-8"><title>' + typeLabel + ' ' + (inv.number||'') + '</title>' +
  '<style>' +
  'html,body{height:100%}' +
  'body{font-family:Arial,sans-serif;margin:0;color:#1f2937;background:#fff;position:relative;box-sizing:border-box;text-align:' + alignStart + '}' +
  '.no-print{display:flex;gap:10px;margin-bottom:24px}' +
  '@media print{body{margin:0}.no-print{display:none}@page{size:A4}}' +
  '</style></head><body dir="' + dirAttr + '">' +
  '<div class="no-print">' +
  '<button onclick="window.print()" style="padding:10px 20px;background:' + D.accent + ';color:#fff;border:none;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer">' + svgIcon('printDownload',14) + ' ' + ptx('printBtn') + '</button>' +
  '<button onclick="window.close()" style="padding:10px 20px;background:#6b7280;color:#fff;border:none;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer">' + svgIcon('x',14) + ' ' + ptx('closeBtn') + '</button>' +
  '</div>' +
  '<div style="position:relative;display:flex;flex-direction:column;min-height:1123px;padding:32px;box-sizing:border-box">' +
  (state.businessLogo ? '<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:0;pointer-events:none"><img src="' + state.businessLogo + '" style="width:1000px;height:1000px;object-fit:contain;opacity:0.06"></div>' : '') +
  '<div style="position:relative;z-index:1">' +
  (D.logoPos === 'center' && state.businessLogo ? '<div style="text-align:center;margin-bottom:16px">' + invLogoHtml(D, 'classic') + '</div>' : '') +
  '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px">' +
  '<div style="display:flex;align-items:center;gap:10px">' +
  (D.logoPos === 'left' ? invLogoHtml(D, 'classic') : '') +
  '<div>' +
  '<div style="font-size:28px;font-weight:700;color:#1e293b">' + bizName + '</div>' +
  '<div style="font-size:12px;color:#9ca3af;margin-top:6px">' + bizContactLine + '</div>' +
  invHeaderTextHtml(D, '#475569') +
  '</div>' +
  '</div>' +
  '<div style="text-align:' + alignEnd + '">' +
  (D.logoPos === 'right' && state.businessLogo ? '<div style="margin-bottom:10px">' + invLogoHtml(D, 'classic') + '</div>' : '') +
  '<div style="font-size:32px;font-weight:700;color:#9ca3af;letter-spacing:2px">' + typeLabel + '</div>' +
  '<div style="font-size:14px;font-weight:600;margin-top:4px">' + ltrSpan(inv.number||'') + '</div>' +
  '<div style="font-size:12px;color:#6b7280;margin-top:4px">' + ptx('issueLbl') + ': ' + ltrSpan(formatDateDisplay(inv.issueDate||'')) + '</div>' +
  (inv.dueDate ? '<div style="font-size:12px;color:#6b7280">' + ptx('dueLbl') + ': ' + ltrSpan(formatDateDisplay(inv.dueDate)) + '</div>' : '') +
  '</div>' +
  '</div>' +
  '<div style="border-top:3px solid ' + D.accent + ';margin-bottom:24px"></div>' +
  '<div style="margin-bottom:24px">' +
  '<div style="font-size:12px;font-weight:700;color:#6b7280;text-transform:uppercase;margin-bottom:6px">' + billLabel + '</div>' +
  '<div style="font-size:15px;font-weight:700">' + partyName + '</div>' +
  (inv.supplierInvNum ? '<div style="font-size:12px;color:#6b7280;margin-top:2px">' + ptx('supplierInvNum') + ': ' + ltrSpan(inv.supplierInvNum) + '</div>' : '') +
  (paymentMethodLabel ? '<div style="font-size:12px;color:#6b7280;margin-top:2px">' + ptx('paymentLbl') + ': ' + paymentMethodLabel + '</div>' : '') +
  '</div>' +
  '<table style="width:100%;border-collapse:collapse;margin-bottom:24px">' +
  '<thead><tr style="background:' + invTint(D.accent, 0.08) + '">' +
  '<th style="padding:10px;border:1px solid #e2e8f0;text-align:' + alignStart + ';font-size:13px">' + ptx('description') + '</th>' +
  '<th style="padding:10px;border:1px solid #e2e8f0;text-align:center;font-size:13px">' + ptx('qty') + '</th>' +
  '<th style="padding:10px;border:1px solid #e2e8f0;text-align:' + alignEnd + ';font-size:13px">' + ptx('unitPrice') + '</th>' +
  '<th style="padding:10px;border:1px solid #e2e8f0;text-align:' + alignEnd + ';font-size:13px">' + ptx('subtotal') + '</th>' +
  '</tr></thead><tbody>' + itemRows + '</tbody></table>' +
  '<div style="display:flex;justify-content:flex-end">' +
  '<div style="width:260px">' +
  '<div style="display:flex;justify-content:space-between;padding:6px 0"><span style="font-size:13px;color:#6b7280">' + ptx('subtotal') + '</span><span style="font-size:13px">' + ltrSpan(cur + parseFloat(inv.subtotal||0).toFixed(2)) + '</span></div>' +
  '<div style="display:flex;justify-content:space-between;padding:6px 0"><span style="font-size:13px;color:#6b7280">' + ptx('vat') + ' (' + (inv.vatRate||0) + '%)</span><span style="font-size:13px">' + ltrSpan(cur + parseFloat(inv.vatAmount||0).toFixed(2)) + '</span></div>' +
  '<div style="display:flex;justify-content:space-between;padding:10px;border:2px solid ' + D.accent + ';border-radius:8px;margin-top:8px"><span style="font-size:18px;font-weight:700">' + ptx('total') + '</span><span style="font-size:18px;font-weight:700;color:' + D.accent + '">' + ltrSpan(cur + parseFloat(inv.total||0).toFixed(2)) + '</span></div>' +
  '</div></div>' +
  (showBankBox ? '<div style="display:flex;gap:16px;align-items:flex-start;margin-top:20px">' + bankBoxHtml + qrHtml + '</div>' : '') +
  notesHtml +
  '</div>' +
  '<div style="position:relative;z-index:1;border-top:1px solid #e2e8f0;margin-top:auto;padding-top:12px;text-align:center;font-size:12px;color:#9ca3af">' +
  invFooterHtml(D) +
  '</div>' +
  '</div>' +
  '</body></html>';

  return doc;
}

function buildModernInvoice(inv, type) {
  var isRTL = false; // invoice PDFs always render German/LTR, regardless of app language
  var dirAttr = isRTL ? 'rtl' : 'ltr';
  var alignStart = isRTL ? 'right' : 'left';
  var alignEnd = isRTL ? 'left' : 'right';
  var D = invDesign('modern'), accent = D.accent;
  var typeLabel = type==='issued' ? ptx('invoice') : type==='receipt' ? ptx('receipt') : ptx('receivedInvoice');
  var billLabel = type==='received' ? ptx('fromSupplier') : ptx('billTo');
  var partyName = inv.clientName || inv.supplierName || '';
  var cur = inv.currency || state.currency;
  var bizName = state.businessName || 'Your Company Name';
  var bizAddress = state.businessAddress || '';
  var bizTaxId = state.businessTaxId || '';
  var bizPhone = state.businessPhone || '';
  var bizEmail = state.businessEmail || '';
  var bizContactLine = [bizAddress, bizEmail, bizPhone, bizTaxId ? 'UID: ' + bizTaxId : ''].filter(Boolean).join('<br>');

  var itemRows = '';
  var items = inv.items || [];
  for(var i=0;i<items.length;i++) {
    itemRows += '<tr>' +
      '<td style="padding:10px 6px;border-bottom:1px solid #eef2f6;text-align:' + alignStart + ';font-size:13px">' + (items[i].desc||'') + '</td>' +
      '<td style="padding:10px 6px;border-bottom:1px solid #eef2f6;text-align:center;font-size:13px">' + ltrSpan(items[i].qty||0) + '</td>' +
      '<td style="padding:10px 6px;border-bottom:1px solid #eef2f6;text-align:' + alignEnd + ';font-size:13px">' + ltrSpan(cur + parseFloat(items[i].price||0).toFixed(2)) + '</td>' +
      '<td style="padding:10px 6px;border-bottom:1px solid #eef2f6;text-align:' + alignEnd + ';font-size:13px;font-weight:600">' + ltrSpan(cur + parseFloat(items[i].sub||0).toFixed(2)) + '</td>' +
      '</tr>';
  }

  var notesHtml = '';
  if(inv.notes) {
    notesHtml = '<div style="margin-top:24px"><div style="font-size:13px;font-weight:700;color:#374151;margin-bottom:6px">' + ptx('notes') + '</div>' +
      '<div style="font-size:13px;color:#6b7280;white-space:pre-wrap">' + inv.notes + '</div></div>';
  }

  var paymentMethodLabel = '';
  if(inv.paymentMethod === 'Cash') paymentMethodLabel = itx('cashOpt');
  else if(inv.paymentMethod === 'Bank Transfer') paymentMethodLabel = itx('bankTransferOpt');
  else if(inv.paymentMethod === 'Card') paymentMethodLabel = itx('cardOpt');
  else if(inv.paymentMethod === 'Other') paymentMethodLabel = itx('otherOpt');

  var showBankBox = state.bankIban && (type === 'issued' || (type === 'receipt' && inv.paymentMethod === 'Bank Transfer'));
  var bankBoxHtml = '';
  var qrHtml = '';
  if(showBankBox) {
    bankBoxHtml = '<div style="flex:1;font-size:12px;color:#475569;background:#f8fafc;border-radius:10px;padding:12px;text-align:' + alignStart + '">' +
      '<div style="font-weight:700;margin-bottom:6px;color:' + accent + '">' + ptx('paymentDetails') + '</div>' +
      (state.bankName ? '<div>' + ptx('bank') + ': ' + state.bankName + '</div>' : '') +
      (state.bankIban ? '<div>' + ptx('iban') + ': ' + ltrSpan(state.bankIban) + '</div>' : '') +
      (state.bankBic ? '<div>' + ptx('bic') + ': ' + ltrSpan(state.bankBic) + '</div>' : '') +
      (state.bankAccountHolder ? '<div>' + ptx('accountHolder') + ': ' + state.bankAccountHolder + '</div>' : '') +
      '</div>';
    qrHtml = '<div id="epc-qr-' + inv.id + '" style="width:120px;height:120px;flex-shrink:0"></div>';
  }

  var doc = '<!DOCTYPE html><html dir="' + dirAttr + '"><head><meta charset="utf-8"><title>' + typeLabel + ' ' + (inv.number||'') + '</title>' +
  '<style>' +
  'html,body{height:100%}' +
  'body{font-family:Arial,sans-serif;margin:0;color:#1f2937;background:#fff;box-sizing:border-box;text-align:' + alignStart + '}' +
  '.no-print{display:flex;gap:10px;padding:16px 40px 0}' +
  '@media print{.no-print{display:none}@page{size:A4}}' +
  '</style></head><body dir="' + dirAttr + '">' +
  invoiceNoPrintBar() +
  '<div style="display:flex;flex-direction:column;min-height:1043px;box-sizing:border-box">' +

  (D.logoPos === 'center' && state.businessLogo ? '<div style="background:' + accent + ';padding:28px 40px 0;text-align:center">' + invLogoHtml(D, 'modern') + '</div>' : '') +
  '<div style="background:' + accent + ';color:#fff;padding:36px 40px;display:flex;justify-content:space-between;align-items:center">' +
  '<div style="display:flex;align-items:center;gap:14px">' +
  (D.logoPos === 'left' ? invLogoHtml(D, 'modern') : '') +
  '<div>' +
  '<div style="font-size:22px;font-weight:700">' + bizName + '</div>' +
  '<div style="font-size:11px;opacity:0.85;margin-top:4px;line-height:1.5">' + bizContactLine + '</div>' +
  invHeaderTextHtml(D, 'rgba(255,255,255,.92)') +
  '</div>' +
  '</div>' +
  '<div style="text-align:' + alignEnd + '">' +
  (D.logoPos === 'right' && state.businessLogo ? '<div style="margin-bottom:10px">' + invLogoHtml(D, 'modern') + '</div>' : '') +
  '<div style="font-size:26px;font-weight:700;letter-spacing:1px">' + typeLabel + '</div>' +
  '<div style="font-size:13px;font-weight:600;margin-top:4px;opacity:0.9">' + ltrSpan(inv.number||'') + '</div>' +
  '</div>' +
  '</div>' +

  '<div style="flex:1;padding:32px 40px">' +
  '<div style="display:flex;justify-content:space-between;gap:24px;margin-bottom:24px">' +
  '<div>' +
  '<div style="font-size:11px;font-weight:700;color:#94a3b8;text-transform:uppercase;margin-bottom:6px">' + billLabel + '</div>' +
  '<div style="font-size:15px;font-weight:700">' + partyName + '</div>' +
  (inv.supplierInvNum ? '<div style="font-size:12px;color:#6b7280;margin-top:2px">' + ptx('supplierInvNum') + ': ' + ltrSpan(inv.supplierInvNum) + '</div>' : '') +
  (paymentMethodLabel ? '<div style="font-size:12px;color:#6b7280;margin-top:2px">' + ptx('paymentLbl') + ': ' + paymentMethodLabel + '</div>' : '') +
  '</div>' +
  '<div style="text-align:' + alignEnd + '">' +
  '<div style="font-size:12px;color:#6b7280">' + ptx('issueLbl') + ': <b>' + ltrSpan(formatDateDisplay(inv.issueDate||'')) + '</b></div>' +
  (inv.dueDate ? '<div style="font-size:12px;color:#6b7280;margin-top:2px">' + ptx('dueLbl') + ': <b>' + ltrSpan(formatDateDisplay(inv.dueDate)) + '</b></div>' : '') +
  '</div>' +
  '</div>' +

  '<table style="width:100%;border-collapse:collapse;margin-bottom:20px">' +
  '<thead><tr>' +
  '<th style="padding:8px 6px;border-bottom:2px solid ' + accent + ';text-align:' + alignStart + ';font-size:11px;color:#94a3b8;text-transform:uppercase">' + ptx('description') + '</th>' +
  '<th style="padding:8px 6px;border-bottom:2px solid ' + accent + ';text-align:center;font-size:11px;color:#94a3b8;text-transform:uppercase">' + ptx('qty') + '</th>' +
  '<th style="padding:8px 6px;border-bottom:2px solid ' + accent + ';text-align:' + alignEnd + ';font-size:11px;color:#94a3b8;text-transform:uppercase">' + ptx('unitPrice') + '</th>' +
  '<th style="padding:8px 6px;border-bottom:2px solid ' + accent + ';text-align:' + alignEnd + ';font-size:11px;color:#94a3b8;text-transform:uppercase">' + ptx('subtotal') + '</th>' +
  '</tr></thead><tbody>' + itemRows + '</tbody></table>' +

  '<div style="display:flex;justify-content:flex-end">' +
  '<div style="width:260px;background:#f8fafc;border-radius:10px;padding:14px 16px">' +
  '<div style="display:flex;justify-content:space-between;padding:4px 0"><span style="font-size:13px;color:#6b7280">' + ptx('subtotal') + '</span><span style="font-size:13px">' + ltrSpan(cur + parseFloat(inv.subtotal||0).toFixed(2)) + '</span></div>' +
  '<div style="display:flex;justify-content:space-between;padding:4px 0"><span style="font-size:13px;color:#6b7280">' + ptx('vat') + ' (' + (inv.vatRate||0) + '%)</span><span style="font-size:13px">' + ltrSpan(cur + parseFloat(inv.vatAmount||0).toFixed(2)) + '</span></div>' +
  '<div style="display:flex;justify-content:space-between;padding-top:10px;margin-top:6px;border-top:1.5px solid #dbeafe"><span style="font-size:16px;font-weight:700">' + ptx('total') + '</span><span style="font-size:16px;font-weight:700;color:' + accent + '">' + ltrSpan(cur + parseFloat(inv.total||0).toFixed(2)) + '</span></div>' +
  '</div></div>' +
  (showBankBox ? '<div style="display:flex;gap:16px;align-items:flex-start;margin-top:20px">' + bankBoxHtml + qrHtml + '</div>' : '') +
  notesHtml +
  '</div>' +

  '<div style="border-top:1px solid #eef2f6;margin-top:auto;padding:14px 40px;text-align:center;font-size:12px;color:#9ca3af">' +
  invFooterHtml(D) +
  '</div>' +
  '</div>' +
  '</body></html>';

  return doc;
}



var DE_MONTH_NAMES = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];

function invoiceNoPrintBar() {
  return '<div class="no-print">' +
    '<button onclick="window.print()" style="padding:10px 20px;background:#0061a4;color:#fff;border:none;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer">' + svgIcon('printDownload',14) + ' ' + ptx('printBtn') + '</button>' +
    '<button onclick="window.close()" style="padding:10px 20px;background:#6b7280;color:#fff;border:none;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer">' + svgIcon('x',14) + ' ' + ptx('closeBtn') + '</button>' +
    '</div>';
}

function generateEPCQR(containerId, inv, doc, size) {
  doc = doc || document;
  size = size || 120;
  var el = doc.getElementById(containerId);
  if (!el) return;
  if (typeof QRCode === 'undefined') return;
  var bic = state.bankBic || '';
  var holder = (state.bankAccountHolder || state.businessName || '').substring(0, 70);
  var iban = (state.bankIban || '').replace(/\s/g, '');
  var amount = 'EUR' + (parseFloat(inv.total) || 0).toFixed(2);
  var ref = (inv.number || '').substring(0, 35);
  var epcStr = 'BCD\n002\n1\nSCT\n' + bic + '\n' + holder + '\n' + iban + '\n' + amount + '\n\n\n' + ref;
  new QRCode(el, {text: epcStr, width: size, height: size, colorDark: '#000000', colorLight: '#ffffff'});
}

function printInvoice(inv, type) {
  if(!inv) return;
  var win = window.open('','_blank','width=800,height=1000');
  if(!win) return;
  var doc = buildInvoiceHTML(inv, type);
  win.document.write(doc);
  win.document.close();
  var qrSize = type === 'receipt' ? 100 : 120;
  setTimeout(function(){ generateEPCQR('epc-qr-' + inv.id, inv, win.document, qrSize); }, 400);
}

function downloadInvoicePDF(inv, type) {
  if(!inv) return;
  var toast = document.createElement('div');
  toast.textContent = itx('downloadingPdf');
  toast.style.cssText = 'position:fixed;top:16px;left:50%;transform:translateX(-50%);background:#0061a4;color:#fff;padding:12px 20px;border-radius:10px;font-size:13px;font-weight:600;z-index:999999;box-shadow:0 4px 16px rgba(0,0,0,0.2);animation:notifIn 0.4s ease';
  document.body.appendChild(toast);
  setTimeout(function(){
    if(toast.parentNode) toast.parentNode.removeChild(toast);
  }, 4000);

  if (typeof html2canvas === 'undefined' || typeof jspdf === 'undefined') {
    showToast('PDF library not loaded. Please check your internet connection.', 'error');
    return;
  }

  var html = buildInvoiceHTML(inv, type);
  var cover = document.createElement('div');
  cover.style.cssText = 'position:fixed;inset:0;background:#fff;z-index:2147483646;';
  document.body.appendChild(cover);
  var el = document.createElement('div');
  el.style.cssText = 'position:fixed;top:0;left:0;width:794px;background:#fff;z-index:2147483647;';
  el.innerHTML = html;
  var noPrintEls = el.querySelectorAll('.no-print');
  for(var i=0;i<noPrintEls.length;i++) noPrintEls[i].style.display = 'none';
  document.body.appendChild(el);
  var pdfQrSize = type === 'receipt' ? 100 : 120;
  generateEPCQR('epc-qr-' + inv.id, inv, document, pdfQrSize);

  var filename = (inv.number || 'invoice') + '.pdf';

  function cleanup() {
    if(el.parentNode) el.parentNode.removeChild(el);
    if(cover.parentNode) cover.parentNode.removeChild(cover);
  }

  function waitForImages(container, timeoutMs) {
    return new Promise(function(resolve) {
      var imgs = container.querySelectorAll('img');
      if(!imgs.length) { resolve(); return; }
      var remaining = imgs.length;
      var done = false;
      function finishOne() {
        remaining--;
        if(remaining <= 0 && !done) { done = true; resolve(); }
      }
      for(var i=0;i<imgs.length;i++) {
        if(imgs[i].complete) { finishOne(); continue; }
        imgs[i].addEventListener('load', finishOne);
        imgs[i].addEventListener('error', finishOne);
      }
      setTimeout(function(){ if(!done) { done = true; resolve(); } }, timeoutMs);
    });
  }

  waitForImages(el, 2000).then(function() {
    return html2canvas(el, {scale: 2, useCORS: true});
  }).then(function(canvas) {
    var scale = 2;
    var elTop = el.getBoundingClientRect().top;
    var rows = el.querySelectorAll('tr');
    var rowBoundaries = [];
    for(var ri=0; ri<rows.length; ri++) {
      var rowRect = rows[ri].getBoundingClientRect();
      rowBoundaries.push((rowRect.bottom - elTop) * scale);
    }
    cleanup();

    var pdf = new jspdf.jsPDF({unit: 'mm', format: 'a4', orientation: 'portrait'});
    var pageWidth = pdf.internal.pageSize.getWidth();
    var pageHeight = pdf.internal.pageSize.getHeight();
    var margin = 10;
    var usableWidth = pageWidth - margin * 2;
    var usableHeight = pageHeight - margin * 2;
    var pxPerMm = canvas.width / usableWidth;
    var pageHeightPx = usableHeight * pxPerMm;

    var sourceY = 0;
    var firstPage = true;
    while(sourceY < canvas.height - 1) {
      var remainingPx = canvas.height - sourceY;
      var sliceHeightPx = Math.min(pageHeightPx, remainingPx);
      if(remainingPx > pageHeightPx) {
        var idealBreak = sourceY + sliceHeightPx;
        var bestBreak = null;
        for(var bi=0; bi<rowBoundaries.length; bi++) {
          var b = rowBoundaries[bi];
          if(b > sourceY && b <= idealBreak) bestBreak = b;
        }
        if(bestBreak && bestBreak > sourceY) sliceHeightPx = bestBreak - sourceY;
      }
      var sliceCanvas = document.createElement('canvas');
      sliceCanvas.width = canvas.width;
      sliceCanvas.height = sliceHeightPx;
      var ctx = sliceCanvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);
      ctx.drawImage(canvas, 0, sourceY, canvas.width, sliceHeightPx, 0, 0, canvas.width, sliceHeightPx);
      var sliceData = sliceCanvas.toDataURL('image/jpeg', 0.98);
      var sliceHeightMm = sliceHeightPx / pxPerMm;
      if(!firstPage) pdf.addPage();
      pdf.addImage(sliceData, 'JPEG', margin, margin, usableWidth, sliceHeightMm);
      sourceY += sliceHeightPx;
      firstPage = false;
    }
    pdf.save(filename);
  }).catch(function() {
    cleanup();
    showToast('Could not generate PDF. Please try again.', 'error');
  });
}

// ═══════════════ INVOICE SHARE (Client / Custom Email / WhatsApp) ═══════════════
var _shareInvoice = null;
var _shareInvoiceType = null;
var _invoiceShareMode = 'client';

function buildInvoiceShareText(inv, type) {
  var typeLabel = type === 'issued' ? 'INVOICE' : type === 'receipt' ? 'RECEIPT' : 'RECEIVED INVOICE';
  var biz = state.businessName || 'Trabis';
  var partyName = inv.clientName || inv.supplierName || '';
  var cur = inv.currency || state.currency;
  var items = inv.items || [];
  var itemLines = items.map(function(it) {
    return '- ' + (it.desc || '') + ' x' + (it.qty || 0) + ': ' + cur + parseFloat(it.sub || 0).toFixed(2);
  }).join('\n');
  var text = typeLabel + ' ' + (inv.number || '') + '\n'
    + biz + '\n'
    + (partyName ? 'To: ' + partyName + '\n' : '')
    + 'Date: ' + (inv.issueDate || '') + '\n\n'
    + (itemLines ? itemLines + '\n\n' : '')
    + 'Total: ' + cur + parseFloat(inv.total || 0).toFixed(2);
  return text;
}



function closeInvoiceShareModal() {
  var modal = document.getElementById('invShareModal');
  if(modal) modal.style.display = 'none';
  _shareInvoice = null;
  _shareInvoiceType = null;
}



function onInvoiceShareClientChange() {
  var sel = document.getElementById('ivshClientSelect');
  var info = document.getElementById('ivshClientInfo');
  if(!sel || !info) return;
  var lang = state.lang;
  var list = _shareInvoiceType === 'received' ? (state.suppliers || []) : (state.clients || []);
  var idx = sel.value;
  if(idx === '') { info.textContent = ''; return; }
  var c = list[parseInt(idx, 10)];
  if(!c) { info.textContent = ''; return; }
  var noEmailLbl = {en:'no email',ar:'لا يوجد بريد',de:'keine E-Mail'}[lang]||'no email';
  var noPhoneLbl = {en:'no phone',ar:'لا يوجد هاتف',de:'kein Telefon'}[lang]||'no phone';
  info.innerHTML = svgIcon('mail',12) + ' ' + escHtml(c.email || noEmailLbl) + '   ' + svgIcon('phone',12) + ' ' + escHtml(c.phone || noPhoneLbl);
}

function setInvoiceShareMode(mode) {
  _invoiceShareMode = mode;
  var clientFields = document.getElementById('ivshClientFields');
  var customFields = document.getElementById('ivshCustomFields');
  var clientBtn = document.getElementById('ivshModeClientBtn');
  var customBtn = document.getElementById('ivshModeCustomBtn');
  if(clientFields) clientFields.style.display = mode === 'client' ? '' : 'none';
  if(customFields) customFields.style.display = mode === 'custom' ? '' : 'none';
  if(clientBtn) {
    clientBtn.style.background = mode === 'client' ? 'var(--card)' : 'none';
    clientBtn.style.color = mode === 'client' ? 'var(--primary)' : 'var(--text3)';
    clientBtn.style.boxShadow = mode === 'client' ? 'var(--shadow)' : 'none';
  }
  if(customBtn) {
    customBtn.style.background = mode === 'custom' ? 'var(--card)' : 'none';
    customBtn.style.color = mode === 'custom' ? 'var(--primary)' : 'var(--text3)';
    customBtn.style.boxShadow = mode === 'custom' ? 'var(--shadow)' : 'none';
  }
  var err = document.getElementById('ivshError');
  if(err) err.style.display = 'none';
}



function sendInvoiceShare(channel) {
  if(!_shareInvoice) return;
  var lang = state.lang;
  var err = document.getElementById('ivshError');
  var recipientEmail = '';
  var recipientPhone = '';

  if(_invoiceShareMode === 'client') {
    var sel = document.getElementById('ivshClientSelect');
    var list = _shareInvoiceType === 'received' ? (state.suppliers || []) : (state.clients || []);
    var idx = sel ? sel.value : '';
    if(idx === '') {
      var pickErr = {en:'Please select a client.',ar:'يرجى اختيار عميل.',de:'Bitte wählen Sie einen Kunden.'}[lang]||'Please select a client.';
      if(err) { err.textContent = pickErr; err.style.display = 'block'; }
      return;
    }
    var c = list[parseInt(idx, 10)];
    if(c) { recipientEmail = c.email || ''; recipientPhone = c.phone || ''; }
  } else {
    var emailInput = document.getElementById('ivshCustomEmail');
    var phoneInput = document.getElementById('ivshCustomPhone');
    recipientEmail = emailInput ? emailInput.value.trim() : '';
    recipientPhone = phoneInput ? phoneInput.value.trim() : '';
  }

  var text = buildInvoiceShareText(_shareInvoice, _shareInvoiceType);

  if(channel === 'email') {
    if(!recipientEmail) {
      var emErr = {en:'No email address available for this recipient.',ar:'لا يوجد بريد إلكتروني لهذا المستلم.',de:'Keine E-Mail-Adresse für diesen Empfänger verfügbar.'}[lang]||'No email address available for this recipient.';
      if(err) { err.textContent = emErr; err.style.display = 'block'; }
      return;
    }
    var typeLabel = _shareInvoiceType === 'receipt' ? 'Receipt' : 'Invoice';
    var subject = typeLabel + ' ' + (_shareInvoice.number || '') + ' — ' + (state.businessName || 'Trabis');
    closeInvoiceShareModal();
    window.location.href = 'mailto:' + encodeURIComponent(recipientEmail) + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(text);
  } else if(channel === 'whatsapp') {
    if(!recipientPhone) {
      var phErr = {en:'No WhatsApp number available for this recipient.',ar:'لا يوجد رقم واتساب لهذا المستلم.',de:'Keine WhatsApp-Nummer für diesen Empfänger verfügbar.'}[lang]||'No WhatsApp number available for this recipient.';
      if(err) { err.textContent = phErr; err.style.display = 'block'; }
      return;
    }
    var digits = recipientPhone.replace(/[^0-9]/g, '');
    closeInvoiceShareModal();
    window.open('https://wa.me/' + digits + '?text=' + encodeURIComponent(text));
  }
}

// ════════════════════════════════════════
// ── CLIENTS ──
// ════════════════════════════════════════



var _editingClientId = null;


// ════════════════════════════════════════
// ── RECURRING PAYMENTS ──
// ════════════════════════════════════════


// ════════════════════════════════════════
// ── BUDGET ──
// ════════════════════════════════════════


// ════════════════════════════════════════
// ── BREAK-EVEN ──
// ════════════════════════════════════════

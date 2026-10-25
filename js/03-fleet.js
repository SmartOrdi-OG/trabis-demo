// ── FLEET / FAHRZEUGE ──
var FLEET_L = {
  title:      {en:'Fleet', ar:'الأسطول', de:'Fuhrpark'},
  add:        {en:'+ Add Vehicle', ar:'+ إضافة مركبة', de:'+ Fahrzeug hinzufügen'},
  addTitle:   {en:'Add Vehicle', ar:'إضافة مركبة', de:'Fahrzeug hinzufügen'},
  empty:      {en:'No vehicles yet', ar:'لا توجد مركبات بعد', de:'Noch keine Fahrzeuge'},
  plate:      {en:'License Plate', ar:'رقم اللوحة', de:'Kennzeichen'},
  name:       {en:'Name / Label', ar:'الاسم / التسمية', de:'Name / Bezeichnung'},
  type:       {en:'Type / Model', ar:'النوع / الموديل', de:'Typ / Modell'},
  year:       {en:'Year', ar:'سنة الصنع', de:'Baujahr'},
  notes:      {en:'Notes', ar:'ملاحظات', de:'Notizen'},
  notesPh:    {en:'Add notes...', ar:'أضف ملاحظات...', de:'Notizen hinzufügen...'},
  documents:  {en:'Documents', ar:'المستندات', de:'Dokumente'},
  maintenance:{en:'Maintenance & Expenses', ar:'الصيانة والمصاريف', de:'Wartung & Ausgaben'},
  save:       {en:'Save', ar:'حفظ', de:'Speichern'},
  cancel:     {en:'Cancel', ar:'إلغاء', de:'Abbrechen'},
  back:       {en:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px"><polyline points="15 18 9 12 15 6"/></svg> Back', ar:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px"><polyline points="9 18 15 12 9 6"/></svg> رجوع', de:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px"><polyline points="15 18 9 12 15 6"/></svg> Zurück'},
  edit:       {en:'Edit', ar:'تعديل', de:'Bearbeiten'},
  deleteBtn:  {en:'Delete Vehicle', ar:'حذف المركبة', de:'Fahrzeug löschen'},
  confirmDelete: {en:'Delete this vehicle? All its documents and maintenance records will be removed too.', ar:'حذف هذه المركبة؟ هيتم حذف كل مستنداتها وسجل الصيانة بتاعها كمان.', de:'Dieses Fahrzeug löschen? Alle Dokumente und Wartungseinträge werden ebenfalls gelöscht.'},
  docCamera:  {en:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg> Camera', ar:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg> كاميرا', de:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg> Kamera'},
  docUpload:  {en:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg> Upload', ar:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg> رفع ملف', de:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg> Hochladen'},
  docNoDocs:  {en:'No documents yet', ar:'لا توجد مستندات بعد', de:'Noch keine Dokumente'},
  docNamePh:  {en:'Document name (e.g. Pickerl, TÜV, Insurance)', ar:'اسم المستند (مثال: Pickerl، TÜV، تأمين)', de:'Dokumentname (z.B. Pickerl, TÜV, Versicherung)'},
  docExpiry:  {en:'Expiry date (optional)', ar:'تاريخ الانتهاء (اختياري)', de:'Ablaufdatum (optional)'},
  docSave:    {en:'Save Document', ar:'حفظ المستند', de:'Dokument speichern'},
  docCancel:  {en:'Cancel', ar:'إلغاء', de:'Abbrechen'},
  docExpiresOn: {en:'Expires', ar:'ينتهي في', de:'Läuft ab am'},
  docExpired: {en:'Expired', ar:'منتهي', de:'Abgelaufen'},
  docExpiresSoon: {en:'Expires soon', ar:'قريب الانتهاء', de:'Läuft bald ab'},
  confirmDeleteDoc: {en:'Delete this document?', ar:'حذف هذا المستند؟', de:'Dieses Dokument löschen?'},
  maintAdd:      {en:'+ Add Entry', ar:'+ إضافة تسجيل', de:'+ Eintrag hinzufügen'},
  maintAddTitle: {en:'Add Maintenance / Expense', ar:'إضافة صيانة / مصروف', de:'Wartung / Ausgabe hinzufügen'},
  maintEditTitle:{en:'Edit Entry', ar:'تعديل التسجيل', de:'Eintrag bearbeiten'},
  maintDate:     {en:'Date', ar:'التاريخ', de:'Datum'},
  maintDesc:     {en:'Description', ar:'الوصف', de:'Beschreibung'},
  maintCost:     {en:'Cost', ar:'التكلفة', de:'Kosten'},
  maintCategory: {en:'Category', ar:'الفئة', de:'Kategorie'},
  maintNoEntries:{en:'No maintenance or expenses logged yet', ar:'لا توجد صيانة أو مصاريف مسجلة بعد', de:'Noch keine Wartung oder Ausgaben erfasst'},
  maintTotal:    {en:'Total logged', ar:'الإجمالي المسجل', de:'Gesamt erfasst'},
  maintConfirmDelete: {en:'Delete this entry?', ar:'حذف هذا التسجيل؟', de:'Diesen Eintrag löschen?'},
  maintInvalid:  {en:'Enter a valid date and cost', ar:'ادخل تاريخ وتكلفة صحيحين', de:'Bitte gültiges Datum und gültige Kosten eingeben'},
  catService: {en:'Service', ar:'صيانة دورية', de:'Service'},
  catRepair:  {en:'Repair', ar:'إصلاح', de:'Reparatur'},
  catFuel:    {en:'Fuel', ar:'وقود', de:'Treibstoff'},
  catInsurance:{en:'Insurance', ar:'تأمين', de:'Versicherung'},
  catOther:   {en:'Other', ar:'أخرى', de:'Sonstiges'},
  asset:          {en:'Acquisition', ar:'طريقة الحصول عليها', de:'Anschaffung'},
  assetHint:      {en:'How this vehicle was acquired, and its purchase details.', ar:'طريقة الحصول على العربية وتفاصيل الشراء.', de:'Wie dieses Fahrzeug erworben wurde, und die Kaufdetails.'},
  assetPrice:     {en:'Purchase Price (Net)', ar:'سعر الشراء (Netto)', de:'Anschaffungswert (Netto)'},
  assetVat:       {en:'VAT %', ar:'نسبة الضريبة %', de:'MwSt. %'},
  assetDate:      {en:'Purchase Date', ar:'تاريخ الشراء', de:'Anschaffungsdatum'},
  assetNotLinked: {en:'Acquisition details not added yet', ar:'لسه ما اتضافتش تفاصيل الحصول عليها', de:'Anschaffungsdetails noch nicht hinzugefügt'},
  assetLinkBtn:   {en:'Add Acquisition Details', ar:'إضافة تفاصيل الحصول عليها', de:'Anschaffungsdetails hinzufügen'},
  supplierName:   {en:'Supplier / Lessor Name', ar:'اسم المورد / المؤجر', de:'Name des Lieferanten / Vermieters'},
  supplierPhone:  {en:'Supplier / Lessor Phone', ar:'تليفون المورد / المؤجر', de:'Telefon des Lieferanten / Vermieters'},
  supplierEmail:  {en:'Supplier / Lessor Email', ar:'إيميل المورد / المؤجر', de:'E-Mail des Lieferanten / Vermieters'},
  acqType:        {en:'Acquisition Type', ar:'نوع الحصول عليها', de:'Erwerbsart'},
  acqPurchase:    {en:'Full Purchase', ar:'شراء كامل', de:'Kauf'},
  acqRentToOwn:   {en:'Rent-to-Own', ar:'إيجار مع الشراء', de:'Mietkauf'},
  acqLeasing:     {en:'Leasing', ar:'ليزينج', de:'Leasing'},
  acqInstallment: {en:'Installment', ar:'تقسيط', de:'Ratenkauf'},
  acqRentOnly:    {en:'Rent Only', ar:'إيجار فقط', de:'Nur Miete'},
  installToggle:  {en:'Split price as a fixed monthly expense (Ausschreibung)', ar:'قسّم السعر كمصروف شهري ثابت (Ausschreibung)', de:'Preis als fixe monatliche Ausgabe aufteilen (Ausschreibung)'},
  installHint:    {en:'For purchases the accountant agrees not to expense all at once (e.g. over €1000 in Austria). The price is split evenly across the months you choose and posted as a recurring monthly expense.', ar:'للمشتريات اللي المحاسب متفق إنها ماتتحسبش مصروف كامل مرة واحدة (زي أي حاجة فوق ١٠٠٠ يورو في النمسا). السعر بيتقسم بالتساوي على عدد الشهور اللي تختاره ويتسجل كمصروف شهري ثابت.', de:'Für Anschaffungen, die der Steuerberater nicht auf einmal absetzen lässt (z.B. über 1000€ in Österreich). Der Preis wird gleichmäßig auf die gewählten Monate verteilt und als wiederkehrende monatliche Ausgabe erfasst.'},
  installMonths:  {en:'Number of Months', ar:'عدد الشهور', de:'Anzahl der Monate'},
  installProgress:{en:'Installment progress', ar:'تقدّم التقسيط', de:'Ratenfortschritt'},
  installRemaining:{en:'Remaining balance', ar:'الرصيد المتبقي', de:'Restbetrag'},
  sellBtn:        {en:'Sell Vehicle', ar:'بيع العربية', de:'Fahrzeug verkaufen'},
  sellTitle:      {en:'Sell Vehicle', ar:'بيع العربية', de:'Fahrzeug verkaufen'},
  sellPrice:      {en:'Sale Price', ar:'سعر البيع', de:'Verkaufspreis'},
  sellDate:       {en:'Sale Date', ar:'تاريخ البيع', de:'Verkaufsdatum'},
  sellConfirm:    {en:'Confirm Sale', ar:'تأكيد البيع', de:'Verkauf bestätigen'},
  sellInvalid:    {en:'Enter a valid sale price and date', ar:'ادخل سعر وتاريخ بيع صحيحين', de:'Bitte gültigen Verkaufspreis und Datum eingeben'},
  fbTitle:        {en:'Fahrtenbuch (Logbook)', ar:'دفتر السيارة (Fahrtenbuch)', de:'Fahrtenbuch'},
  fbAdd:          {en:'+ Add Trip', ar:'+ إضافة رحلة', de:'+ Fahrt hinzufügen'},
  fbExport:       {en:'Export PDF', ar:'تصدير PDF', de:'PDF exportieren'},
  fbEmpty:        {en:'No trips logged yet', ar:'لا توجد رحلات مسجلة بعد', de:'Noch keine Fahrten erfasst'},
  fbColDate:      {en:'Date', ar:'التاريخ', de:'Datum'},
  fbColDepTime:   {en:'Dep. Time', ar:'وقت المغادرة', de:'Abf.-Zeit'},
  fbColDepLoc:    {en:'Departure', ar:'مكان المغادرة', de:'Abfahrtsort'},
  fbColDepKm:     {en:'Km (Start)', ar:'عداد (بداية)', de:'Km-Stand'},
  fbColArrTime:   {en:'Arr. Time', ar:'وقت الوصول', de:'Ank.-Zeit'},
  fbColArrLoc:    {en:'Arrival', ar:'مكان الوصول', de:'Ankunftsort'},
  fbColArrKm:     {en:'Km (End)', ar:'عداد (نهاية)', de:'Km-Stand'},
  fbColDrivenKm:  {en:'Km Driven', ar:'كم مقطوعة', de:'Gef. km'},
  fbColPurpose:   {en:'Purpose', ar:'الغرض', de:'Reisezweck'},
  fbColCustomer:  {en:'Customer', ar:'العميل', de:'Kunde'},
  fbColDuration:  {en:'Duration', ar:'مدة الرحلة', de:'Dauer'},
  fbColPrivateKm: {en:'Private km', ar:'خاص كم', de:'Privat km'},
  fbColBusinessKm:{en:'Business km', ar:'خدمة كم', de:'Dienst km'},
  fbSumme:        {en:'Total', ar:'الإجمالي', de:'Summe'},
  fbConfirmDeleteRow: {en:'Delete this trip entry?', ar:'حذف سجل الرحلة دي؟', de:'Diesen Fahrteintrag löschen?'},
};
function fleettx(k) { return (FLEET_L[k] && FLEET_L[k][state.lang]) || (FLEET_L[k] && FLEET_L[k].en) || k; }
var FLEET_CATS = ['catService','catRepair','catFuel','catInsurance','catOther'];

// ── Depreciation (shared by Fleet vehicles and general Assets) ──
function monthsBetween(fromDateStr, toDateStr) {
  var f = new Date(fromDateStr + 'T00:00:00'), t = new Date(toDateStr + 'T00:00:00');
  var months = (t.getFullYear() - f.getFullYear()) * 12 + (t.getMonth() - f.getMonth());
  if(t.getDate() < f.getDate()) months -= 1;
  return Math.max(0, months);
}


function renderFleetPage() {
  var page = document.getElementById('fleetPage');
  if(!page) return;

  var h = '';
  h += '<div style="padding:16px 16px 0"><div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">';
  h += '<div style="display:flex;align-items:center;gap:8px">' + moreBackBtnHtml() + '<div style="font-size:18px;font-weight:700">' + fleettx('title') + '</div></div>';
  h += '<button id="fleetAddBtn" style="background:#0061a4;color:#fff;border:none;border-radius:10px;padding:8px 14px;font-size:13px;font-weight:600;cursor:pointer">' + fleettx('add') + '</button>';
  h += '</div></div>';

  h += '<div id="fleetPageBody" style="padding:0 16px 120px">';
  if(!state.fleet.length) {
    h += '<div style="text-align:center;padding:60px 20px;color:var(--text3);font-size:14px">' + fleettx('empty') + '</div>';
  } else {
    state.fleet.forEach(function(v) {
      var displayName = v.name || v.plate || '';
      h += '<div class="emp-card" data-id="' + v.id + '" style="background:var(--card);border-radius:16px;padding:16px;margin-bottom:10px;display:flex;align-items:center;gap:14px;cursor:pointer;box-shadow:var(--shadow)">';
      h += '<div style="width:48px;height:48px;border-radius:50%;background:var(--primary);color:#fff;display:flex;align-items:center;justify-content:center;flex-shrink:0">' + svgIcon('truck', 22) + '</div>';
      h += '<div style="flex:1;min-width:0">';
      h += '<div style="font-size:15px;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + escHtml(displayName) + '</div>';
      h += '<div style="font-size:12px;color:var(--text3);margin-top:2px">' + [v.plate, v.type, v.year].filter(Boolean).map(escHtml).join(' · ') + '</div>';
      h += '</div>';
      h += svgIcon('chevronRight', 18);
      h += '</div>';
    });
  }
  h += '</div>';

  page.innerHTML = h;

  var addBtn = document.getElementById('fleetAddBtn');
  if(addBtn) addBtn.onclick = openAddVehicleForm;

  var cards = page.querySelectorAll('.emp-card');
  for(var ci = 0; ci < cards.length; ci++) {
    (function(card) {
      var id = parseInt(card.getAttribute('data-id'), 10);
      card.onclick = function(){ renderVehicleProfile(id); };
    })(cards[ci]);
  }
}

function closeAddVehicleForm() {
  var ov = document.getElementById('fleetAddOverlay');
  if(ov) ov.parentNode.removeChild(ov);
}

function openAddVehicleForm() {
  var existing = document.getElementById('fleetAddOverlay');
  if(existing) existing.parentNode.removeChild(existing);

  var ov = document.createElement('div');
  ov.id = 'fleetAddOverlay';
  ov.className = 'modal-overlay open';

  var html = '';
  html += '<div class="modal" id="fleetAddModal">';
  html += '<button class="modal-close-btn" id="fleetAddCloseBtn">' + svgIcon('x', 16) + '</button>';
  html += '<div class="modal-handle"></div>';
  html += '<div class="modal-title">' + fleettx('addTitle') + '</div>';
  html += '<input class="input-field" id="fa-plate" placeholder="' + fleettx('plate') + ' *">';
  html += '<input class="input-field" id="fa-name" placeholder="' + fleettx('name') + '">';
  html += '<input class="input-field" id="fa-type" placeholder="' + fleettx('type') + '">';
  html += '<input class="input-field" id="fa-year" type="number" min="1900" max="2100" placeholder="' + fleettx('year') + '">';
  html += '<div style="display:flex;gap:10px;margin-top:10px">';
  html += '<button id="fleetAddSaveBtn" style="flex:1;background:var(--primary);color:#fff;border:none;border-radius:12px;padding:13px;font-size:15px;font-weight:700;cursor:pointer">' + fleettx('save') + '</button>';
  html += '<button id="fleetAddCancelBtn" style="flex:1;background:var(--bg);color:var(--text2);border:1.5px solid var(--border);border-radius:12px;padding:13px;font-size:15px;font-weight:600;cursor:pointer">' + fleettx('cancel') + '</button>';
  html += '</div>';
  html += '</div>';

  ov.innerHTML = html;
  document.body.appendChild(ov);

  document.getElementById('fleetAddCloseBtn').onclick = closeAddVehicleForm;
  document.getElementById('fleetAddCancelBtn').onclick = closeAddVehicleForm;
  document.getElementById('fleetAddSaveBtn').onclick = saveNewVehicle;
  ov.onclick = function(e) { if(e.target === ov) closeAddVehicleForm(); };
}

function saveNewVehicle() {
  var plateEl = document.getElementById('fa-plate');
  var plate = plateEl ? plateEl.value.trim() : '';
  if(!plate) { if(plateEl) plateEl.focus(); return; }
  var nameEl = document.getElementById('fa-name');
  var typeEl = document.getElementById('fa-type');
  var yearEl = document.getElementById('fa-year');

  state.fleet.push({
    id: Date.now(),
    plate: plate,
    name: (nameEl && nameEl.value.trim()) || '',
    type: (typeEl && typeEl.value.trim()) || '',
    year: (yearEl && yearEl.value.trim()) || '',
    notes: '',
    documents: [],
    maintenance: [],
  });
  save();
  closeAddVehicleForm();
  renderFleetPage();
}

function fleetInfoRow(label, value) {
  return '<div style="margin-bottom:12px"><div style="font-size:12px;color:var(--text3);margin-bottom:2px">' + label + '</div><div style="font-size:14px;color:var(--text)">' + (value ? escHtml(value) : '—') + '</div></div>';
}

var _fleetProfileId = null;
var _fleetProfileEditMode = false;

function closeVehicleProfile() {
  var ov = document.getElementById('fleetProfileOverlay');
  if(ov) ov.parentNode.removeChild(ov);
  renderFleetPage();
}

function renderVehicleProfileCard(v) {
  var card = document.getElementById('fleetProfileCard');
  if(!card) return;
  var displayName = v.name || v.plate || '';

  if(!_fleetProfileEditMode) {
    var html = '';
    html += '<div style="display:flex;align-items:center;gap:14px;margin-bottom:18px">';
    html += '<div style="width:64px;height:64px;border-radius:50%;background:var(--primary);color:#fff;display:flex;align-items:center;justify-content:center;flex-shrink:0">' + svgIcon('truck', 28) + '</div>';
    html += '<div><div style="font-size:18px;font-weight:700">' + escHtml(displayName) + '</div>';
    html += '<div style="font-size:13px;color:var(--text3);margin-top:2px">' + escHtml(v.plate || '') + '</div></div>';
    html += '</div>';
    html += fleetInfoRow(fleettx('type'), v.type);
    html += fleetInfoRow(fleettx('year'), v.year);
    card.innerHTML = html;
  } else {
    var eh = '';
    eh += '<div style="margin-bottom:12px"><label style="font-size:12px;color:var(--text3);display:block;margin-bottom:4px">' + fleettx('plate') + '</label><input id="fpf-plate" class="input-field" style="margin-bottom:0" value="' + escHtml(v.plate || '') + '"></div>';
    eh += '<div style="margin-bottom:12px"><label style="font-size:12px;color:var(--text3);display:block;margin-bottom:4px">' + fleettx('name') + '</label><input id="fpf-name" class="input-field" style="margin-bottom:0" value="' + escHtml(v.name || '') + '"></div>';
    eh += '<div style="margin-bottom:12px"><label style="font-size:12px;color:var(--text3);display:block;margin-bottom:4px">' + fleettx('type') + '</label><input id="fpf-type" class="input-field" style="margin-bottom:0" value="' + escHtml(v.type || '') + '"></div>';
    eh += '<div style="margin-bottom:14px"><label style="font-size:12px;color:var(--text3);display:block;margin-bottom:4px">' + fleettx('year') + '</label><input id="fpf-year" type="number" min="1900" max="2100" class="input-field" style="margin-bottom:0" value="' + escHtml(v.year || '') + '"></div>';
    eh += '<div style="display:flex;gap:10px">';
    eh += '<button id="fpf-saveBtn" style="flex:1;background:var(--primary);color:#fff;border:none;border-radius:10px;padding:11px;font-size:14px;font-weight:700;cursor:pointer">' + fleettx('save') + '</button>';
    eh += '<button id="fpf-cancelBtn" style="flex:1;background:var(--bg);color:var(--text2);border:1.5px solid var(--border);border-radius:10px;padding:11px;font-size:14px;cursor:pointer">' + fleettx('cancel') + '</button>';
    eh += '</div>';
    card.innerHTML = eh;

    document.getElementById('fpf-saveBtn').onclick = function() {
      var plateEl = document.getElementById('fpf-plate');
      var newPlate = plateEl.value.trim();
      if(!newPlate) { plateEl.focus(); return; }
      v.plate = newPlate;
      v.name = document.getElementById('fpf-name').value.trim();
      v.type = document.getElementById('fpf-type').value.trim();
      v.year = document.getElementById('fpf-year').value.trim();
      save();
      _fleetProfileEditMode = false;
      renderVehicleProfileCard(v);
      var titleEl = document.getElementById('fleetProfileTitle');
      if(titleEl) titleEl.textContent = v.name || v.plate;
    };
    document.getElementById('fpf-cancelBtn').onclick = function() {
      _fleetProfileEditMode = false;
      renderVehicleProfileCard(v);
    };
  }
}

var ACQ_TYPES = ['purchase','rentToOwn','leasing','installment','rentOnly'];
var ACQ_TYPE_KEYS = {purchase:'acqPurchase', rentToOwn:'acqRentToOwn', leasing:'acqLeasing', installment:'acqInstallment', rentOnly:'acqRentOnly'};
function acqTypeLabel(t) { return fleettx(ACQ_TYPE_KEYS[t] || 'acqPurchase'); }

function renderVehicleAssetSection(v) {
  var wrap = document.getElementById('fleetAssetSection');
  if(!wrap) return;

  var html = '';
  if(v.acqType) {
    html += fleetInfoRow(fleettx('acqType'), acqTypeLabel(v.acqType));
    if(v.acqType !== 'rentOnly') {
      html += fleetInfoRow(fleettx('assetPrice'), fmt(v.assetValue || 0));
      html += fleetInfoRow(fleettx('assetVat'), (v.assetVatRate || 0) + '%');
      html += fleetInfoRow(fleettx('assetDate'), formatDateDisplay(v.assetPurchaseDate));
    }
    if(v.supplierName || v.supplierPhone || v.supplierEmail) {
      html += fleetInfoRow(fleettx('supplierName'), v.supplierName);
      if(v.supplierPhone) html += fleetInfoRow(fleettx('supplierPhone'), v.supplierPhone);
      if(v.supplierEmail) html += fleetInfoRow(fleettx('supplierEmail'), v.supplierEmail);
    }
    var inst = v.installmentId ? (state.installments || []).find(function(i){ return i.id === v.installmentId; }) : null;
    if(inst) {
      var remaining = Math.max(0, inst.totalNetto - inst.monthlyNetto * inst.monthsPosted);
      html += '<div style="display:flex;gap:10px;margin-top:4px">';
      html += '<div style="flex:1;background:var(--bg);border-radius:12px;padding:12px"><div style="font-size:11px;color:var(--text3)">' + fleettx('installRemaining') + '</div><div style="font-size:17px;font-weight:700;color:var(--primary)">' + fmt(remaining) + '</div></div>';
      html += '<div style="flex:1;background:var(--bg);border-radius:12px;padding:12px"><div style="font-size:11px;color:var(--text3)">' + fleettx('installProgress') + '</div><div style="font-size:17px;font-weight:700;color:var(--text)">' + inst.monthsPosted + '/' + inst.totalMonths + '</div></div>';
      html += '</div>';
    }
    html += '<button onclick="assetFormOpen(' + v.id + ')" style="width:100%;margin-top:12px;padding:11px;border-radius:10px;border:1.5px solid var(--border);background:var(--bg);color:var(--text2);font-size:13px;font-weight:600;cursor:pointer">' + fleettx('edit') + '</button>';
  } else {
    html += '<div style="font-size:13px;color:var(--text3);margin-bottom:10px">' + fleettx('assetNotLinked') + '</div>';
    html += '<button onclick="assetFormOpen(' + v.id + ')" style="width:100%;padding:11px;border-radius:10px;border:none;background:var(--primary);color:#fff;font-size:13px;font-weight:700;cursor:pointer">' + fleettx('assetLinkBtn') + '</button>';
  }
  wrap.innerHTML = html;
}

function assetFormOpen(vehicleId) {
  var v = (state.fleet || []).find(function(x){ return x.id === vehicleId; });
  if(!v) return;

  var existing = document.getElementById('assetFormOverlay');
  if(existing) existing.parentNode.removeChild(existing);

  var ov = document.createElement('div');
  ov.id = 'assetFormOverlay';
  ov.className = 'modal-overlay open';
  ov.style.zIndex = '99999'; // above the full-screen vehicle profile overlay (z-index 9999)
  var acqType = v.acqType || 'purchase';
  var inst = v.installmentId ? (state.installments || []).find(function(i){ return i.id === v.installmentId; }) : null;
  var hasInstallment = !!inst;

  var html = '';
  html += '<div class="modal" id="assetFormModal">';
  html += '<button class="modal-close-btn" id="assetFormCloseBtn">' + svgIcon('x', 16) + '</button>';
  html += '<div class="modal-handle"></div>';
  html += '<div class="modal-title">' + fleettx('asset') + '</div>';
  html += '<div style="font-size:11px;color:var(--text3);margin-bottom:12px;line-height:1.5">' + fleettx('assetHint') + '</div>';

  html += '<label style="font-size:12px;color:var(--text3);display:block;margin-bottom:4px">' + fleettx('acqType') + '</label>';
  html += '<select id="fas-acqtype" class="input-field">';
  ACQ_TYPES.forEach(function(t) {
    html += '<option value="' + t + '"' + (t===acqType?' selected':'') + '>' + acqTypeLabel(t) + '</option>';
  });
  html += '</select>';

  html += '<div id="fas-priceWrap">';
  html += '<label style="font-size:12px;color:var(--text3);display:block;margin-bottom:4px">' + fleettx('assetPrice') + '</label>';
  html += '<input id="fas-price" type="text" inputmode="decimal" oninput="sanitizeAmountField(this)" class="input-field" value="' + (v.assetValue || '') + '">';
  html += '<label style="font-size:12px;color:var(--text3);display:block;margin-bottom:4px">' + fleettx('assetVat') + '</label>';
  html += '<input id="fas-vat" type="number" min="0" max="100" step="0.1" class="input-field" value="' + (v.assetVatRate != null ? v.assetVatRate : 20) + '">';
  html += '<label style="font-size:12px;color:var(--text3);display:block;margin-bottom:4px">' + fleettx('assetDate') + '</label>';
  html += '<div class="date-fix-wrap"><input id="fas-date" type="date" class="input-field" value="' + (v.assetPurchaseDate || today()) + '"></div>';
  html += '</div>';

  html += '<label style="font-size:12px;color:var(--text3);display:block;margin-bottom:4px">' + fleettx('supplierName') + '</label>';
  html += '<input id="fas-supplierName" type="text" class="input-field" value="' + escHtml(v.supplierName || '') + '">';
  html += '<label style="font-size:12px;color:var(--text3);display:block;margin-bottom:4px">' + fleettx('supplierPhone') + '</label>';
  html += '<input id="fas-supplierPhone" type="tel" class="input-field" value="' + escHtml(v.supplierPhone || '') + '">';
  html += '<label style="font-size:12px;color:var(--text3);display:block;margin-bottom:4px">' + fleettx('supplierEmail') + '</label>';
  html += '<input id="fas-supplierEmail" type="email" class="input-field" value="' + escHtml(v.supplierEmail || '') + '">';

  html += '<div id="fas-installWrap" style="' + (acqType==='purchase' ? '' : 'display:none') + '">';
  html += '<label style="display:flex;align-items:center;gap:8px;font-size:13px;color:var(--text);margin-bottom:8px;cursor:pointer"><input type="checkbox" id="fas-installToggle"' + (hasInstallment?' checked':'') + '> ' + fleettx('installToggle') + '</label>';
  html += '<div style="font-size:11px;color:var(--text3);margin-bottom:10px;line-height:1.5">' + fleettx('installHint') + '</div>';
  html += '<div id="fas-monthsWrap" style="' + (hasInstallment?'':'display:none') + '">';
  html += '<label style="font-size:12px;color:var(--text3);display:block;margin-bottom:4px">' + fleettx('installMonths') + '</label>';
  html += '<input id="fas-months" type="number" min="1" step="1" class="input-field" value="' + (inst ? inst.totalMonths : 24) + '"' + (hasInstallment && inst.monthsPosted > 0 ? ' disabled' : '') + '>';
  html += '</div>';
  html += '</div>';

  html += '<div style="display:flex;gap:10px">';
  html += '<button id="fas-saveBtn" style="flex:1;background:var(--primary);color:#fff;border:none;border-radius:10px;padding:11px;font-size:14px;font-weight:700;cursor:pointer">' + fleettx('save') + '</button>';
  html += '<button id="fas-cancelBtn" style="flex:1;background:var(--bg);color:var(--text2);border:1.5px solid var(--border);border-radius:10px;padding:11px;font-size:14px;cursor:pointer">' + fleettx('cancel') + '</button>';
  html += '</div></div>';
  ov.innerHTML = html;
  document.body.appendChild(ov);

  function close() { var o = document.getElementById('assetFormOverlay'); if(o) o.parentNode.removeChild(o); }
  document.getElementById('assetFormCloseBtn').onclick = close;
  document.getElementById('fas-cancelBtn').onclick = close;
  ov.onclick = function(e) { if(e.target === ov) close(); };

  var acqTypeSel = document.getElementById('fas-acqtype');
  var priceWrap = document.getElementById('fas-priceWrap');
  var installWrap = document.getElementById('fas-installWrap');
  function syncVisibility() {
    var t = acqTypeSel.value;
    priceWrap.style.display = t === 'rentOnly' ? 'none' : '';
    installWrap.style.display = t === 'purchase' ? '' : 'none';
  }
  acqTypeSel.onchange = syncVisibility;

  var installToggle = document.getElementById('fas-installToggle');
  var monthsWrap = document.getElementById('fas-monthsWrap');
  installToggle.onchange = function() { monthsWrap.style.display = installToggle.checked ? '' : 'none'; };

  document.getElementById('fas-saveBtn').onclick = function() {
    var t = acqTypeSel.value;
    v.acqType = t;
    if(t === 'rentOnly') {
      v.assetValue = 0; v.assetVatRate = 0; v.assetPurchaseDate = '';
    } else {
      v.assetValue = parseAmount(document.getElementById('fas-price').value) || 0;
      v.assetVatRate = parseFloat(document.getElementById('fas-vat').value) || 0;
      v.assetPurchaseDate = document.getElementById('fas-date').value || today();
    }
    v.supplierName = document.getElementById('fas-supplierName').value.trim();
    v.supplierPhone = document.getElementById('fas-supplierPhone').value.trim();
    v.supplierEmail = document.getElementById('fas-supplierEmail').value.trim();

    var wantsInstallment = t === 'purchase' && installToggle.checked;
    if(wantsInstallment) {
      var months = parseInt(document.getElementById('fas-months').value, 10) || 1;
      if(inst) {
        if(inst.monthsPosted === 0) {
          inst.totalMonths = months;
          inst.totalNetto = v.assetValue;
          inst.monthlyNetto = v.assetValue / months;
          inst.vatRate = v.assetVatRate;
        }
      } else {
        var newInst = {
          id: Date.now(),
          name: v.name || v.plate || fleettx('title'),
          totalNetto: v.assetValue, vatRate: v.assetVatRate, startDate: v.assetPurchaseDate,
          totalMonths: months, monthlyNetto: v.assetValue / months,
          monthsPosted: 0, lastRecorded: null,
          linkedVehicleId: v.id, linkedAssetId: null, status: 'active'
        };
        state.installments.push(newInst);
        v.installmentId = newInst.id;
      }
    } else if(inst) {
      inst.status = 'stopped';
      v.installmentId = null;
    }

    save();
    checkInstallmentsDue();
    close();
    renderVehicleAssetSection(v);
  };
}

function renderVehicleProfile(id) {
  var found = state.fleet.filter(function(v){ return v.id === id; });
  if(!found.length) return;
  var v = found[0];
  _fleetProfileId = id;
  _fleetProfileEditMode = false;

  var existingOv = document.getElementById('fleetProfileOverlay');
  if(existingOv) existingOv.parentNode.removeChild(existingOv);

  var displayName = v.name || v.plate || '';

  var ov = document.createElement('div');
  ov.id = 'fleetProfileOverlay';
  ov.style.cssText = 'position:fixed;inset:0;z-index:9999;background:var(--bg);overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch';

  var html = '';
  html += '<div style="position:sticky;top:0;z-index:10;background:var(--card);padding:14px 16px;display:flex;align-items:center;gap:12px;border-bottom:1px solid var(--border)">';
  html += '<button id="fleetBackBtn" style="background:none;border:none;color:var(--text);font-size:15px;cursor:pointer;padding:4px">' + fleettx('back') + '</button>';
  html += '<div id="fleetProfileTitle" style="flex:1;font-size:16px;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + escHtml(displayName) + '</div>';
  html += '<button id="fleetEditBtn" style="background:none;border:none;color:var(--primary);font-size:14px;font-weight:700;cursor:pointer;padding:4px">' + fleettx('edit') + '</button>';
  html += '</div>';

  html += '<div style="padding:16px">';
  html += '<div id="fleetProfileCard" style="background:var(--card);border-radius:16px;padding:20px;margin-bottom:14px;box-shadow:var(--shadow)"></div>';

  html += '<div style="background:var(--card);border-radius:16px;padding:16px;margin-bottom:14px;box-shadow:var(--shadow)">';
  html += '<div style="font-size:15px;font-weight:700;margin-bottom:8px">' + fleettx('documents') + '</div>';
  html += '<div id="fleetDocList"></div>';
  html += '<div style="display:flex;gap:8px;margin-top:10px">';
  html += '<button onclick="document.getElementById(\'fleetDocCameraInput\').click()" style="flex:1;padding:10px;border-radius:10px;border:1.5px dashed var(--border);background:var(--bg);color:var(--text2);font-size:13px;font-weight:600;cursor:pointer">' + fleettx('docCamera') + '</button>';
  html += '<button onclick="document.getElementById(\'fleetDocFileInput\').click()" style="flex:1;padding:10px;border-radius:10px;border:1.5px dashed var(--border);background:var(--bg);color:var(--text2);font-size:13px;font-weight:600;cursor:pointer">' + fleettx('docUpload') + '</button>';
  html += '</div>';
  html += '<input type="file" id="fleetDocCameraInput" accept="image/*" capture="environment" style="display:none" onchange="fleetDocFileChosen(this,' + id + ')">';
  html += '<input type="file" id="fleetDocFileInput" accept="image/*,application/pdf" style="display:none" onchange="fleetDocFileChosen(this,' + id + ')">';
  html += '</div>';

  html += '<div style="background:var(--card);border-radius:16px;padding:16px;margin-bottom:14px;box-shadow:var(--shadow)">';
  html += '<div style="font-size:15px;font-weight:700;margin-bottom:8px">' + fleettx('asset') + '</div>';
  html += '<div id="fleetAssetSection"></div>';
  html += '</div>';

  html += '<div style="background:var(--card);border-radius:16px;padding:16px;margin-bottom:14px;box-shadow:var(--shadow)">';
  html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px">';
  html += '<div style="font-size:15px;font-weight:700">' + fleettx('maintenance') + '</div>';
  html += '<button onclick="maintOpenForm(' + id + ')" style="background:none;border:none;color:var(--primary);font-size:13px;font-weight:700;cursor:pointer;padding:4px">' + fleettx('maintAdd') + '</button>';
  html += '</div>';
  html += '<div id="maintSummary" style="font-size:13px;color:var(--text3);margin-bottom:8px"></div>';
  html += '<div id="maintList"></div>';
  html += '</div>';

  html += '<div style="background:var(--card);border-radius:16px;padding:16px;margin-bottom:14px;box-shadow:var(--shadow)">';
  html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">';
  html += '<div style="font-size:15px;font-weight:700">' + fleettx('fbTitle') + '</div>';
  html += '<button onclick="fbOpenMonthSheet(' + id + ')" style="background:none;border:none;color:var(--primary);font-size:13px;font-weight:700;cursor:pointer;padding:4px">' + fleettx('fbAdd') + '</button>';
  html += '</div>';
  html += '<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px">';
  html += '<button id="fbPrevMonthBtn" style="background:var(--bg);border:1px solid var(--border);border-radius:8px;width:32px;height:32px;color:var(--text2);cursor:pointer;flex-shrink:0">' + svgIcon('chevronLeft', 14) + '</button>';
  html += '<div id="fbMonthLabel" style="font-size:14px;font-weight:700;flex:1;text-align:center"></div>';
  html += '<button id="fbNextMonthBtn" style="background:var(--bg);border:1px solid var(--border);border-radius:8px;width:32px;height:32px;color:var(--text2);cursor:pointer;flex-shrink:0">' + svgIcon('chevronRight', 14) + '</button>';
  html += '</div>';
  html += '<div id="fbSummary" style="font-size:13px;color:var(--text3);margin-bottom:8px"></div>';
  html += '<div id="fbList"></div>';
  html += '<button id="fbExportBtn" style="width:100%;margin-top:10px;padding:10px;border-radius:10px;border:1.5px solid var(--border);background:var(--bg);color:var(--text2);font-size:13px;font-weight:600;cursor:pointer">' + svgIcon('download', 13) + ' ' + fleettx('fbExport') + '</button>';
  html += '</div>';

  html += '<div style="background:var(--card);border-radius:16px;padding:16px;margin-bottom:14px;box-shadow:var(--shadow)">';
  html += '<div style="font-size:15px;font-weight:700;margin-bottom:8px">' + fleettx('notes') + '</div>';
  html += '<textarea id="fleetNotesArea" placeholder="' + fleettx('notesPh') + '" rows="4" style="width:100%;border:1.5px solid var(--border);border-radius:10px;padding:10px;background:var(--bg);color:var(--text);font-size:13px;font-family:inherit;resize:vertical;box-sizing:border-box">' + escHtml(v.notes || '') + '</textarea>';
  html += '</div>';

  if(v.acqType && v.acqType !== 'rentOnly') {
    html += '<button id="fleetSellBtn" style="width:100%;background:rgba(22,163,74,0.1);color:var(--green);border:none;border-radius:12px;padding:13px;font-size:14px;font-weight:700;cursor:pointer;margin-top:6px">' + svgIcon('money', 15) + ' ' + fleettx('sellBtn') + '</button>';
  }
  html += '<button id="fleetDeleteBtn" style="width:100%;background:rgba(239,68,68,0.1);color:#ef4444;border:none;border-radius:12px;padding:13px;font-size:14px;font-weight:700;cursor:pointer;margin-top:10px">' + svgIcon('trash', 15) + ' ' + fleettx('deleteBtn') + '</button>';
  html += '</div>';

  ov.innerHTML = html;
  document.body.appendChild(ov);

  renderVehicleProfileCard(v);
  renderFleetDocsSection(v);
  renderVehicleAssetSection(v);
  renderMaintSection(v);
  renderFleetTripsSection(v);

  document.getElementById('fleetBackBtn').onclick = closeVehicleProfile;
  document.getElementById('fleetEditBtn').onclick = function() {
    _fleetProfileEditMode = true;
    renderVehicleProfileCard(v);
  };

  var notesArea = document.getElementById('fleetNotesArea');
  if(notesArea) {
    notesArea.onblur = function() { v.notes = notesArea.value; save(); };
  }

  var sellBtn = document.getElementById('fleetSellBtn');
  if(sellBtn) sellBtn.onclick = function() { openSellVehicleForm(id); };

  document.getElementById('fleetDeleteBtn').onclick = async function() {
    if(!(await confirmAsync(DELETE_CONFIRM_TITLE[state.lang]||DELETE_CONFIRM_TITLE.en, fleettx('confirmDelete')))) return;
    (v.documents || []).forEach(function(d){ fleetDocDeleteRec(d.id); });
    state.fleet = state.fleet.filter(function(x){ return x.id !== id; });
    save();
    var ovEl = document.getElementById('fleetProfileOverlay');
    if(ovEl) ovEl.parentNode.removeChild(ovEl);
    renderFleetPage();
  };
}

function openSellVehicleForm(vehicleId) {
  var v = (state.fleet || []).find(function(x){ return x.id === vehicleId; });
  if(!v) return;

  var existing = document.getElementById('sellVehicleOverlay');
  if(existing) existing.parentNode.removeChild(existing);

  var ov = document.createElement('div');
  ov.id = 'sellVehicleOverlay';
  ov.className = 'modal-overlay open';
  ov.style.zIndex = '99999';
  var html = '';
  html += '<div class="modal" id="sellVehicleModal">';
  html += '<button class="modal-close-btn" id="sellVehicleCloseBtn">' + svgIcon('x', 16) + '</button>';
  html += '<div class="modal-handle"></div>';
  html += '<div class="modal-title">' + fleettx('sellTitle') + '</div>';
  html += '<label style="font-size:12px;color:var(--text3);display:block;margin-bottom:4px">' + fleettx('sellPrice') + '</label>';
  html += '<input id="sv-price" type="text" inputmode="decimal" oninput="sanitizeAmountField(this)" class="input-field">';
  html += '<label style="font-size:12px;color:var(--text3);display:block;margin-bottom:4px">' + fleettx('assetVat') + '</label>';
  html += '<input id="sv-vat" type="number" min="0" max="100" step="0.1" class="input-field" value="' + (v.assetVatRate != null ? v.assetVatRate : 20) + '">';
  html += '<label style="font-size:12px;color:var(--text3);display:block;margin-bottom:4px">' + fleettx('sellDate') + '</label>';
  html += '<div class="date-fix-wrap"><input id="sv-date" type="date" class="input-field" value="' + today() + '"></div>';
  html += '<div id="sv-error" style="display:none;color:#ef4444;font-size:12px;margin:-8px 0 12px"></div>';
  html += '<div style="display:flex;gap:10px">';
  html += '<button id="sv-saveBtn" style="flex:1;background:var(--green);color:#fff;border:none;border-radius:10px;padding:11px;font-size:14px;font-weight:700;cursor:pointer">' + fleettx('sellConfirm') + '</button>';
  html += '<button id="sv-cancelBtn" style="flex:1;background:var(--bg);color:var(--text2);border:1.5px solid var(--border);border-radius:10px;padding:11px;font-size:14px;cursor:pointer">' + fleettx('cancel') + '</button>';
  html += '</div></div>';
  ov.innerHTML = html;
  document.body.appendChild(ov);

  function close() { var o = document.getElementById('sellVehicleOverlay'); if(o) o.parentNode.removeChild(o); }
  document.getElementById('sellVehicleCloseBtn').onclick = close;
  document.getElementById('sv-cancelBtn').onclick = close;
  ov.onclick = function(e) { if(e.target === ov) close(); };

  document.getElementById('sv-saveBtn').onclick = async function() {
    var salePrice = parseAmount(document.getElementById('sv-price').value);
    var saleVat = parseFloat(document.getElementById('sv-vat').value) || 0;
    var saleDate = document.getElementById('sv-date').value;
    var errEl = document.getElementById('sv-error');
    if(!salePrice || salePrice <= 0 || !saleDate) { errEl.textContent = fleettx('sellInvalid'); errEl.style.display = 'block'; return; }

    var vehicleName = v.name || v.plate || '';
    var inst = v.installmentId ? (state.installments || []).find(function(i){ return i.id === v.installmentId; }) : null;
    var saleVb = vatBreakdown(salePrice, saleVat);

    if(inst) {
      var remainingNetto = Math.max(0, inst.totalNetto - inst.monthlyNetto * inst.monthsPosted);
      var diff = saleVb.netto - remainingNetto;
      if(diff > 0.005) {
        state.transactions.push({id: Date.now(), type: 'income', name: vehicleName, category: 'Vehicle', vatRate: saleVat, amount: bruttoFromNetto(diff, saleVat), date: saleDate});
      } else if(diff < -0.005) {
        state.transactions.push({id: Date.now(), type: 'expense', name: vehicleName, category: 'Vehicle', vatRate: saleVat, amount: bruttoFromNetto(Math.abs(diff), saleVat), date: saleDate});
      }
      inst.status = 'stopped';
    } else {
      state.transactions.push({id: Date.now(), type: 'income', name: vehicleName, category: 'Vehicle', vatRate: saleVat, amount: salePrice, date: saleDate});
    }

    (v.documents || []).forEach(function(d){ fleetDocDeleteRec(d.id); });
    state.fleet = state.fleet.filter(function(x){ return x.id !== vehicleId; });
    save();
    close();
    var ovEl = document.getElementById('fleetProfileOverlay');
    if(ovEl) ovEl.parentNode.removeChild(ovEl);
    renderFleetPage();
    renderHome();
  };
}

// ── Fleet documents (mirrors employee documents: local IndexedDB store, custom naming, optional expiry) ──
function makeFileStore(dbName) {
  var inst = null;
  return function() {
    return new Promise(function(resolve, reject) {
      if(inst) { resolve(inst); return; }
      var req = indexedDB.open(dbName, 1);
      req.onupgradeneeded = function(e) {
        var d = e.target.result;
        if(!d.objectStoreNames.contains('files')) d.createObjectStore('files', {keyPath:'id'});
      };
      req.onsuccess = function(e) { inst = e.target.result; resolve(inst); };
      req.onerror = function() { reject(req.error); };
    });
  };
}
var fleetDocDb = makeFileStore('smartac_fleetdocs');
function fleetDocPut(rec) {
  return fleetDocDb().then(function(db) {
    return new Promise(function(res, rej) {
      var t = db.transaction('files', 'readwrite');
      t.objectStore('files').put(rec);
      t.oncomplete = res; t.onerror = function(){ rej(t.error); };
    });
  });
}
function fleetDocGet(id) {
  return fleetDocDb().then(function(db) {
    return new Promise(function(res, rej) {
      var r = db.transaction('files').objectStore('files').get(id);
      r.onsuccess = function(){ res(r.result); }; r.onerror = function(){ rej(r.error); };
    });
  });
}
function fleetDocDeleteRec(id) {
  return fleetDocDb().then(function(db) {
    return new Promise(function(res) {
      var t = db.transaction('files', 'readwrite');
      t.objectStore('files').delete(id);
      t.oncomplete = res; t.onerror = res;
    });
  }).catch(function(){});
}

var _fleetDocPendingFile = null;

function fleetDocFileChosen(input, vehicleId) {
  var f = input.files && input.files[0];
  input.value = '';
  if(!f) return;
  var isPdf = f.type === 'application/pdf';
  receiptCompress(f).then(function(blob) {
    _fleetDocPendingFile = {blob: blob, type: isPdf ? 'application/pdf' : 'image/jpeg'};
    fleetDocOpenNamePrompt(vehicleId, f.name || '');
  });
}

function fleetDocOpenNamePrompt(vehicleId, suggestedName) {
  var existing = document.getElementById('fleetDocNameOverlay');
  if(existing) existing.parentNode.removeChild(existing);
  if(!_fleetDocPendingFile) return;

  var ov = document.createElement('div');
  ov.id = 'fleetDocNameOverlay';
  ov.className = 'modal-overlay open';
  ov.style.zIndex = '99999'; // above the full-screen vehicle profile overlay (z-index 9999)
  var defaultName = suggestedName.replace(/\.[^.]+$/, '');
  var html = '';
  html += '<div class="modal" id="fleetDocNameModal">';
  html += '<button class="modal-close-btn" id="fleetDocNameCloseBtn">' + svgIcon('x', 16) + '</button>';
  html += '<div class="modal-handle"></div>';
  html += '<div class="modal-title">' + fleettx('docSave') + '</div>';
  html += '<input class="input-field" id="fdn-name" placeholder="' + fleettx('docNamePh') + '" value="' + escHtml(defaultName) + '">';
  html += '<label style="font-size:12px;color:var(--text3);display:block;margin-bottom:4px">' + fleettx('docExpiry') + '</label>';
  html += '<div class="date-fix-wrap"><input class="input-field" id="fdn-expiry" type="date"></div>';
  html += '<div style="display:flex;gap:10px;margin-top:10px">';
  html += '<button id="fdn-saveBtn" style="flex:1;background:var(--primary);color:#fff;border:none;border-radius:12px;padding:13px;font-size:15px;font-weight:700;cursor:pointer">' + fleettx('docSave') + '</button>';
  html += '<button id="fdn-cancelBtn" style="flex:1;background:var(--bg);color:var(--text2);border:1.5px solid var(--border);border-radius:12px;padding:13px;font-size:15px;font-weight:600;cursor:pointer">' + fleettx('docCancel') + '</button>';
  html += '</div></div>';
  ov.innerHTML = html;
  document.body.appendChild(ov);

  function close() {
    _fleetDocPendingFile = null;
    var o = document.getElementById('fleetDocNameOverlay');
    if(o) o.parentNode.removeChild(o);
  }
  document.getElementById('fleetDocNameCloseBtn').onclick = close;
  document.getElementById('fdn-cancelBtn').onclick = close;
  ov.onclick = function(e) { if(e.target === ov) close(); };
  document.getElementById('fdn-saveBtn').onclick = function() {
    var nameEl = document.getElementById('fdn-name');
    var name = nameEl.value.trim();
    if(!name) { nameEl.focus(); return; }
    var expiry = document.getElementById('fdn-expiry').value || '';
    fleetDocSave(vehicleId, name, expiry);
    close();
  };
}

function fleetDocSave(vehicleId, name, expiryDate) {
  var v = (state.fleet || []).find(function(x){ return x.id === vehicleId; });
  if(!v || !_fleetDocPendingFile) return;
  var docId = Date.now();
  var pending = _fleetDocPendingFile;
  fleetDocPut({
    id: docId,
    vehicleId: vehicleId,
    user: localStorage.getItem('smartac_user') || '',
    name: name,
    type: pending.type,
    blob: pending.blob,
    createdAt: new Date().toISOString()
  }).then(function() {
    if(!v.documents) v.documents = [];
    v.documents.push({id: docId, name: name, type: pending.type, expiryDate: expiryDate || '', createdAt: new Date().toISOString()});
    save();
    _fleetDocPendingFile = null;
    renderFleetDocsSection(v);
    checkAppointmentReminders();
  });
}

async function fleetDocDelete(vehicleId, docId) {
  if(!(await confirmAsync(DELETE_CONFIRM_TITLE[state.lang]||DELETE_CONFIRM_TITLE.en, fleettx('confirmDeleteDoc')))) return;
  var v = (state.fleet || []).find(function(x){ return x.id === vehicleId; });
  if(!v) return;
  v.documents = (v.documents || []).filter(function(d){ return d.id !== docId; });
  save();
  fleetDocDeleteRec(docId);
  renderFleetDocsSection(v);
}

function fleetDocView(docId) {
  fleetDocGet(docId).then(function(rec) { if(rec) openReceiptViewer(rec); });
}

function fleetDocExpiryBadge(expiryDate) {
  if(!expiryDate) return '';
  var days = Math.round((new Date(expiryDate + 'T00:00:00') - new Date(today() + 'T00:00:00')) / 86400000);
  var label = fleettx('docExpiresOn') + ' ' + formatDateDisplay(expiryDate);
  var color = 'var(--text3)', bg = 'var(--bg)';
  if(days < 0) { label = fleettx('docExpired') + ' · ' + formatDateDisplay(expiryDate); color = '#ef4444'; bg = 'rgba(239,68,68,0.1)'; }
  else if(days <= 30) { label = fleettx('docExpiresSoon') + ' · ' + formatDateDisplay(expiryDate); color = '#ea580c'; bg = 'rgba(234,88,12,0.1)'; }
  return '<span style="font-size:11px;font-weight:600;color:' + color + ';background:' + bg + ';padding:2px 8px;border-radius:8px;white-space:nowrap">' + label + '</span>';
}

function renderFleetDocsSection(v) {
  var wrap = document.getElementById('fleetDocList');
  if(!wrap) return;
  var docs = v.documents || [];
  if(!docs.length) {
    wrap.innerHTML = '<div style="text-align:center;padding:16px;color:var(--text3);font-size:13px">' + fleettx('docNoDocs') + '</div>';
    return;
  }
  var h = '';
  docs.forEach(function(doc) {
    var isPdf = doc.type === 'application/pdf';
    h += '<div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--border)">';
    h += '<span style="font-size:18px;flex-shrink:0">' + (isPdf ? svgIcon('fileText', 20) : svgIcon('paperclip', 20)) + '</span>';
    h += '<div style="flex:1;min-width:0;cursor:pointer" onclick="fleetDocView(' + doc.id + ')">';
    h += '<div style="font-size:14px;font-weight:600;color:var(--primary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + escHtml(doc.name) + '</div>';
    if(doc.expiryDate) h += '<div style="margin-top:3px">' + fleetDocExpiryBadge(doc.expiryDate) + '</div>';
    h += '</div>';
    h += '<button onclick="fleetDocDelete(' + v.id + ',' + doc.id + ')" style="border:none;background:none;color:var(--text3);cursor:pointer;padding:6px;flex-shrink:0">' + svgIcon('trash', 15) + '</button>';
    h += '</div>';
  });
  wrap.innerHTML = h;
}

// ── Fleet maintenance & expenses log (record-keeping only — not posted to transactions/UVA) ──
function maintOpenForm(vehicleId, editId) {
  var v = (state.fleet || []).find(function(x){ return x.id === vehicleId; });
  if(!v) return;
  var editing = editId != null ? (v.maintenance || []).find(function(m){ return m.id === editId; }) : null;

  var existing = document.getElementById('maintFormOverlay');
  if(existing) existing.parentNode.removeChild(existing);

  var ov = document.createElement('div');
  ov.id = 'maintFormOverlay';
  ov.className = 'modal-overlay open';
  ov.style.zIndex = '99999'; // above the full-screen vehicle profile overlay (z-index 9999)
  var html = '';
  html += '<div class="modal" id="maintFormModal">';
  html += '<button class="modal-close-btn" id="maintFormCloseBtn">' + svgIcon('x', 16) + '</button>';
  html += '<div class="modal-handle"></div>';
  html += '<div class="modal-title">' + (editing ? fleettx('maintEditTitle') : fleettx('maintAddTitle')) + '</div>';
  html += '<label style="font-size:12px;color:var(--text3);display:block;margin-bottom:4px">' + fleettx('maintDate') + '</label>';
  html += '<div class="date-fix-wrap"><input class="input-field" id="maint-date" type="date" value="' + (editing ? editing.date : today()) + '"></div>';
  html += '<label style="font-size:12px;color:var(--text3);display:block;margin-bottom:4px">' + fleettx('maintCategory') + '</label>';
  html += '<select id="maint-category" class="input-field">';
  FLEET_CATS.forEach(function(ck) { html += '<option value="' + ck + '"' + (editing && editing.category === ck ? ' selected' : '') + '>' + fleettx(ck) + '</option>'; });
  html += '</select>';
  html += '<input class="input-field" id="maint-desc" placeholder="' + fleettx('maintDesc') + '" value="' + (editing ? escHtml(editing.description || '') : '') + '">';
  html += '<label style="font-size:12px;color:var(--text3);display:block;margin-bottom:4px">' + fleettx('maintCost') + '</label>';
  html += '<input class="input-field" id="maint-cost" type="text" inputmode="decimal" oninput="sanitizeAmountField(this)" value="' + (editing ? editing.cost : '') + '">';
  html += '<div id="maint-error" style="display:none;color:#ef4444;font-size:12px;margin:-8px 0 12px"></div>';
  html += '<div style="display:flex;gap:10px;margin-top:10px">';
  html += '<button id="maintFormSaveBtn" style="flex:1;background:var(--primary);color:#fff;border:none;border-radius:12px;padding:13px;font-size:15px;font-weight:700;cursor:pointer">' + fleettx('save') + '</button>';
  html += '<button id="maintFormCancelBtn" style="flex:1;background:var(--bg);color:var(--text2);border:1.5px solid var(--border);border-radius:12px;padding:13px;font-size:15px;font-weight:600;cursor:pointer">' + fleettx('cancel') + '</button>';
  html += '</div></div>';
  ov.innerHTML = html;
  document.body.appendChild(ov);

  function close() { var o = document.getElementById('maintFormOverlay'); if(o) o.parentNode.removeChild(o); }
  document.getElementById('maintFormCloseBtn').onclick = close;
  document.getElementById('maintFormCancelBtn').onclick = close;
  ov.onclick = function(e) { if(e.target === ov) close(); };
  document.getElementById('maintFormSaveBtn').onclick = function() {
    var date = document.getElementById('maint-date').value;
    var category = document.getElementById('maint-category').value;
    var description = document.getElementById('maint-desc').value.trim();
    var cost = parseAmount(document.getElementById('maint-cost').value);
    var errEl = document.getElementById('maint-error');
    if(!date || !cost || cost < 0 || isNaN(cost)) { errEl.textContent = fleettx('maintInvalid'); errEl.style.display = 'block'; return; }
    if(!v.maintenance) v.maintenance = [];
    if(editing) {
      editing.date = date; editing.category = category; editing.description = description; editing.cost = cost;
    } else {
      v.maintenance.push({id: Date.now(), date: date, category: category, description: description, cost: cost});
    }
    save();
    close();
    renderMaintSection(v);
  };
}

async function maintDelete(vehicleId, entryId) {
  if(!(await confirmAsync(DELETE_CONFIRM_TITLE[state.lang]||DELETE_CONFIRM_TITLE.en, fleettx('maintConfirmDelete')))) return;
  var v = (state.fleet || []).find(function(x){ return x.id === vehicleId; });
  if(!v) return;
  v.maintenance = (v.maintenance || []).filter(function(m){ return m.id !== entryId; });
  save();
  renderMaintSection(v);
}

function renderMaintSection(v) {
  var list = document.getElementById('maintList');
  var summary = document.getElementById('maintSummary');
  if(!list || !summary) return;
  var entries = (v.maintenance || []).slice().sort(function(a,b){
    return a.date < b.date ? 1 : (a.date > b.date ? -1 : b.id - a.id);
  });

  var total = entries.reduce(function(s,m){ return s + (parseFloat(m.cost) || 0); }, 0);
  summary.textContent = fleettx('maintTotal') + ': ' + fmt(total);

  if(!entries.length) {
    list.innerHTML = '<div style="text-align:center;padding:16px;color:var(--text3);font-size:13px">' + fleettx('maintNoEntries') + '</div>';
    return;
  }
  var h = '';
  entries.forEach(function(m) {
    h += '<div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--border)">';
    h += '<div style="flex:1;min-width:0">';
    h += '<div style="font-size:14px;font-weight:600">' + formatDateDisplay(m.date) + ' <span style="color:var(--text3);font-weight:400">· ' + fleettx(m.category) + '</span></div>';
    if(m.description) h += '<div style="font-size:12px;color:var(--text3);margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + escHtml(m.description) + '</div>';
    h += '</div>';
    h += '<div style="font-size:14px;font-weight:700;color:var(--expense);white-space:nowrap">' + fmt(m.cost) + '</div>';
    h += '<button onclick="maintOpenForm(' + v.id + ',' + m.id + ')" style="border:none;background:none;color:var(--text3);cursor:pointer;padding:6px;flex-shrink:0">' + svgIcon('pencil', 14) + '</button>';
    h += '<button onclick="maintDelete(' + v.id + ',' + m.id + ')" style="border:none;background:none;color:var(--text3);cursor:pointer;padding:6px;flex-shrink:0">' + svgIcon('trash', 14) + '</button>';
    h += '</div>';
  });
  list.innerHTML = h;
}

// ── FAHRTENBUCH (Vehicle Trip Logbook) ──
// Monthly sheet: one pre-generated row per calendar day of the selected month,
// matching the official Fahrtenbuch template exactly — mirrors the Work Hours
// (Arbeitszeiterfassung) month-sheet pattern: browse by month, tap edit to open
// a full sheet with every day of that month, fill in freely, save in one batch.
var FB_FIELDS = ['depTime','depLocation','depKm','arrTime','arrLocation','arrKm','drivenKm','purpose','customer','duration','privateKm','businessKm'];

function fbDayEntry(v, day) {
  return (v.trips || []).find(function(t){ return t.date === day; });
}

function fbGridAutoCalc(day) {
  var depEl = document.getElementById('fbd-depKm-' + day), arrEl = document.getElementById('fbd-arrKm-' + day), drivenEl = document.getElementById('fbd-drivenKm-' + day);
  if(!depEl || !arrEl || !drivenEl) return;
  var dep = parseFloat(depEl.value), arr = parseFloat(arrEl.value);
  if(!isNaN(dep) && !isNaN(arr) && arr >= dep) drivenEl.value = (arr - dep).toString();
}

function fbShiftMonth(delta) {
  var parts = _fbViewMonth.split('-');
  var d = new Date(parseInt(parts[0],10), parseInt(parts[1],10)-1 + delta, 1);
  _fbViewMonth = d.getFullYear() + '-' + pad2(d.getMonth()+1);
  var v = (state.fleet || []).find(function(x){ return x.id === _fleetProfileId; });
  if(v) renderFleetTripsSection(v);
}

function fbCellInput(day, field, type) {
  var id = 'fbd-' + field + '-' + day;
  var isNum = type === 'number';
  var oninputAttr = isNum ? ' oninput="sanitizeAmountField(this)"' : '';
  if(field === 'depKm' || field === 'arrKm') oninputAttr = ' oninput="fbGridAutoCalc(\'' + day + '\')"';
  var inputType = isNum ? 'text' : type;
  var inputMode = isNum ? ' inputmode="decimal"' : '';
  var style = 'width:100%;padding:5px;border:1px solid var(--border);border-radius:6px;background:var(--bg);color:var(--text);font-size:12px;box-sizing:border-box';
  return '<input type="' + inputType + '" id="' + id + '"' + inputMode + oninputAttr + ' style="' + style + '">';
}

function fbOpenMonthSheet(vehicleId) {
  var v = (state.fleet || []).find(function(x){ return x.id === vehicleId; });
  if(!v) return;
  if(!_fbViewMonth) _fbViewMonth = today().substring(0,7);
  var monthKey = _fbViewMonth;
  var days = whDaysInMonth(monthKey);
  var displayName = v.name || v.plate || '';

  var existing = document.getElementById('fbSheetOverlay');
  if(existing) existing.parentNode.removeChild(existing);

  var ov = document.createElement('div');
  ov.id = 'fbSheetOverlay';
  ov.style.cssText = 'position:fixed;inset:0;z-index:100000;background:var(--bg);overflow-y:auto;-webkit-overflow-scrolling:touch';

  var cols = [
    ['depTime','time',fleettx('fbColDepTime'),70], ['depLocation','text',fleettx('fbColDepLoc'),110], ['depKm','number',fleettx('fbColDepKm'),75],
    ['arrTime','time',fleettx('fbColArrTime'),70], ['arrLocation','text',fleettx('fbColArrLoc'),110], ['arrKm','number',fleettx('fbColArrKm'),75],
    ['drivenKm','number',fleettx('fbColDrivenKm'),70], ['purpose','text',fleettx('fbColPurpose'),120], ['customer','text',fleettx('fbColCustomer'),110],
    ['duration','text',fleettx('fbColDuration'),65], ['privateKm','number',fleettx('fbColPrivateKm'),75], ['businessKm','number',fleettx('fbColBusinessKm'),75]
  ];

  var html = '';
  html += '<div style="position:sticky;top:0;z-index:5;background:var(--card);padding:14px 16px;display:flex;align-items:center;gap:12px;border-bottom:1px solid var(--border)">';
  html += '<button id="fbSheetCloseBtn" style="background:none;border:none;color:var(--text);font-size:15px;cursor:pointer;padding:4px">' + fleettx('cancel') + '</button>';
  html += '<div style="flex:1;font-size:16px;font-weight:700;text-align:center">' + whAtMonthLabel(monthKey) + '</div>';
  html += '<button id="fbSheetSaveBtn" style="background:none;border:none;color:var(--primary);font-size:15px;font-weight:700;cursor:pointer;padding:4px">' + fleettx('save') + '</button>';
  html += '</div>';
  html += '<div style="padding:10px 16px 0;font-size:12px;color:var(--text2)">Fahrtenbuch für Kfz-Kennzeichen: <b>' + escHtml(v.plate || '') + '</b> · ' + escHtml(displayName) + '</div>';

  html += '<div style="padding:12px;overflow-x:auto">';
  html += '<table style="border-collapse:collapse;width:100%;min-width:1300px;font-size:12px">';
  html += '<thead><tr style="background:var(--bg2,var(--card));border-bottom:2px solid var(--border)">';
  html += '<th style="padding:8px 6px;text-align:left;font-weight:700;white-space:nowrap;border:1px solid var(--border);min-width:90px">' + fleettx('fbColDate') + '</th>';
  cols.forEach(function(c) {
    html += '<th style="padding:8px 5px;text-align:left;font-weight:700;white-space:nowrap;border:1px solid var(--border);min-width:' + c[3] + 'px">' + c[2] + '</th>';
  });
  html += '</tr></thead><tbody>';

  days.forEach(function(day) {
    html += '<tr style="border-bottom:1px solid var(--border)">';
    html += '<td style="padding:6px;border:1px solid var(--border);white-space:nowrap;color:var(--text2)">' + whFmtDayDate(day) + '</td>';
    cols.forEach(function(c) {
      html += '<td style="padding:3px;border:1px solid var(--border)">' + fbCellInput(day, c[0], c[1]) + '</td>';
    });
    html += '</tr>';
  });
  html += '</tbody></table></div>';

  ov.innerHTML = html;
  document.body.appendChild(ov);

  // Populate values after insertion (avoids escaping every attribute inline above)
  days.forEach(function(day) {
    var entry = fbDayEntry(v, day);
    if(!entry) return;
    FB_FIELDS.forEach(function(f) {
      var el = document.getElementById('fbd-' + f + '-' + day);
      if(el && entry[f] != null) el.value = entry[f];
    });
  });

  function close() { var o = document.getElementById('fbSheetOverlay'); if(o) o.parentNode.removeChild(o); }
  document.getElementById('fbSheetCloseBtn').onclick = close;
  document.getElementById('fbSheetSaveBtn').onclick = function() {
    if(!v.trips) v.trips = [];
    var idCounter = 0;
    days.forEach(function(day) {
      var rowVals = {};
      FB_FIELDS.forEach(function(f) { var el = document.getElementById('fbd-' + f + '-' + day); rowVals[f] = el ? el.value : ''; });
      var hasData = FB_FIELDS.some(function(f) { return rowVals[f] !== ''; });
      var entry = fbDayEntry(v, day);
      if(!hasData) {
        if(entry) v.trips = v.trips.filter(function(t){ return t.id !== entry.id; });
        return;
      }
      if(entry) {
        FB_FIELDS.forEach(function(f) { entry[f] = rowVals[f]; });
      } else {
        var newEntry = {id: Date.now() + (idCounter++), date: day};
        FB_FIELDS.forEach(function(f) { newEntry[f] = rowVals[f]; });
        v.trips.push(newEntry);
      }
    });
    save();
    close();
    renderFleetTripsSection(v);
  };
}

async function fbDelete(vehicleId, entryId) {
  if(!(await confirmAsync(DELETE_CONFIRM_TITLE[state.lang]||DELETE_CONFIRM_TITLE.en, fleettx('fbConfirmDeleteRow')))) return;
  var v = (state.fleet || []).find(function(x){ return x.id === vehicleId; });
  if(!v) return;
  v.trips = (v.trips || []).filter(function(t){ return t.id !== entryId; });
  save();
  renderFleetTripsSection(v);
}

function fbMonthLabelText(monthKey) {
  var parts = monthKey.split('-');
  var monthNames = KAL_MONTH_NAMES[state.lang] || KAL_MONTH_NAMES.en;
  return monthNames[parseInt(parts[1],10)-1] + ' ' + parts[0];
}

function renderFleetTripsSection(v) {
  var list = document.getElementById('fbList');
  var summary = document.getElementById('fbSummary');
  var monthLabelEl = document.getElementById('fbMonthLabel');
  if(!list || !summary) return;
  if(!_fbViewMonth) _fbViewMonth = today().substring(0,7);
  if(monthLabelEl) monthLabelEl.textContent = fbMonthLabelText(_fbViewMonth);

  var entries = (v.trips || []).filter(function(t){ return (t.date||'').substring(0,7) === _fbViewMonth; })
    .sort(function(a,b){ return a.date < b.date ? 1 : (a.date > b.date ? -1 : b.id - a.id); });

  var sumDriven = entries.reduce(function(s,t){ return s + (parseFloat(t.drivenKm)||0); }, 0);
  var sumPrivate = entries.reduce(function(s,t){ return s + (parseFloat(t.privateKm)||0); }, 0);
  var sumBusiness = entries.reduce(function(s,t){ return s + (parseFloat(t.businessKm)||0); }, 0);
  summary.textContent = fleettx('fbSumme') + ': ' + sumDriven.toFixed(1) + ' km  ·  ' + fleettx('fbColPrivateKm') + ' ' + sumPrivate.toFixed(1) + '  ·  ' + fleettx('fbColBusinessKm') + ' ' + sumBusiness.toFixed(1);

  var prevBtn = document.getElementById('fbPrevMonthBtn');
  if(prevBtn) prevBtn.onclick = function(){ fbShiftMonth(-1); };
  var nextBtn = document.getElementById('fbNextMonthBtn');
  if(nextBtn) nextBtn.onclick = function(){ fbShiftMonth(1); };
  var exportBtn = document.getElementById('fbExportBtn');
  if(exportBtn) exportBtn.onclick = function(){ fleetTripsExportPDF(v.id); };

  if(!entries.length) {
    list.innerHTML = '<div style="text-align:center;padding:16px;color:var(--text3);font-size:13px">' + fleettx('fbEmpty') + '</div>';
    return;
  }
  var h = '';
  entries.forEach(function(t) {
    var route = (t.depLocation || '?') + ' → ' + (t.arrLocation || '?');
    h += '<div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--border)">';
    h += '<div style="flex:1;min-width:0">';
    h += '<div style="font-size:14px;font-weight:600">' + whFmtDayDate(t.date) + ' <span style="color:var(--text3);font-weight:400">· ' + escHtml(route) + '</span></div>';
    if(t.purpose) h += '<div style="font-size:12px;color:var(--text3);margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + escHtml(t.purpose) + '</div>';
    h += '</div>';
    h += '<div style="font-size:14px;font-weight:700;color:var(--primary);white-space:nowrap">' + (parseFloat(t.drivenKm)||0) + ' km</div>';
    h += '<button onclick="fbOpenMonthSheet(' + v.id + ')" style="border:none;background:none;color:var(--text3);cursor:pointer;padding:6px;flex-shrink:0">' + svgIcon('pencil', 14) + '</button>';
    h += '<button onclick="fbDelete(' + v.id + ',' + t.id + ')" style="border:none;background:none;color:var(--text3);cursor:pointer;padding:6px;flex-shrink:0">' + svgIcon('trash', 14) + '</button>';
    h += '</div>';
  });
  list.innerHTML = h;
}

function fleetTripsExportPDF(vehicleId) {
  var v = (state.fleet || []).find(function(x){ return x.id === vehicleId; });
  if(!v) return;
  var JsPdf = (window.jspdf && window.jspdf.jsPDF) ? window.jspdf.jsPDF : (window.jsPDF || null);
  if(!JsPdf) { showToast('PDF library not available', 'error'); return; }
  if(!_fbViewMonth) _fbViewMonth = today().substring(0,7);
  var trips = (v.trips || []).filter(function(t){ return (t.date||'').substring(0,7) === _fbViewMonth; })
    .sort(function(a,b){ return a.date < b.date ? -1 : (a.date > b.date ? 1 : a.id - b.id); });
  var doc = new JsPdf({orientation:'l', unit:'mm', format:'a4'});
  var displayName = v.name || v.plate || '';

  var cols = [
    {tx:'fbColDate', w:16}, {tx:'fbColDepTime', w:12}, {tx:'fbColDepLoc', w:26}, {tx:'fbColDepKm', w:15},
    {tx:'fbColArrTime', w:12}, {tx:'fbColArrLoc', w:26}, {tx:'fbColArrKm', w:15}, {tx:'fbColDrivenKm', w:14},
    {tx:'fbColPurpose', w:26}, {tx:'fbColCustomer', w:24}, {tx:'fbColDuration', w:14}, {tx:'fbColPrivateKm', w:14}, {tx:'fbColBusinessKm', w:14}
  ];
  var startX = 8, tableWidth = cols.reduce(function(s,c){ return s+c.w; }, 0);

  function drawHeader(y) {
    doc.setFontSize(9); doc.setFont(undefined, 'normal');
    doc.text('Fahrtenbuch für Kfz-Kennzeichen: ' + (v.plate || '') + '   ' + whAtMonthLabel(_fbViewMonth), startX, y);
    doc.text(String(state.businessName || ''), startX + tableWidth/2, y, {align:'center'});
    y += 6;
    doc.setFont(undefined, 'bold'); doc.setFontSize(7.5);
    var x = startX;
    cols.forEach(function(c) {
      doc.text(fleettx(c.tx), x + 1, y);
      x += c.w;
    });
    y += 2;
    doc.line(startX, y, startX + tableWidth, y);
    doc.setFont(undefined, 'normal');
    return y + 4;
  }

  var y = drawHeader(14);
  var sumDriven = 0, sumPrivate = 0, sumBusiness = 0;
  var fieldMap = ['date','depTime','depLocation','depKm','arrTime','arrLocation','arrKm','drivenKm','purpose','customer','duration','privateKm','businessKm'];

  trips.forEach(function(t) {
    sumDriven += parseFloat(t.drivenKm) || 0;
    sumPrivate += parseFloat(t.privateKm) || 0;
    sumBusiness += parseFloat(t.businessKm) || 0;
    if(y > 195) { doc.addPage(); y = drawHeader(14); }
    var x = startX;
    doc.setFontSize(7.5);
    cols.forEach(function(c, i) {
      var f = fieldMap[i];
      var val = f === 'date' ? whFmtDayDate(t.date) : t[f];
      var text = val != null && val !== '' ? String(val) : '';
      doc.text(text.substring(0, 18), x + 1, y);
      x += c.w;
    });
    y += 5.5;
  });

  y += 1; doc.line(startX, y, startX + tableWidth, y); y += 5;
  doc.setFont(undefined, 'bold'); doc.setFontSize(8);
  doc.text(fleettx('fbSumme'), startX + 1, y);
  var sumX = startX + cols[0].w + cols[1].w + cols[2].w + cols[3].w + cols[4].w + cols[5].w + cols[6].w;
  doc.text(sumDriven.toFixed(1), sumX + 1, y);
  var privX = sumX + cols[7].w + cols[8].w + cols[9].w + cols[10].w;
  doc.text(sumPrivate.toFixed(1), privX + 1, y);
  doc.text(sumBusiness.toFixed(1), privX + cols[11].w + 1, y);

  doc.save('Fahrtenbuch_' + (v.plate || displayName || 'vehicle') + '_' + _fbViewMonth + '.pdf');
}

// ── ANLAGEVERMÖGEN (Assets) ──
var ASSETS_L = {
  title:      {en:'Assets', ar:'الأصول', de:'Vermögenswerte'},
  sub:        {en:'Company assets & big purchases', ar:'أصول الشركة والمشتريات الكبيرة', de:'Firmenvermögen & größere Anschaffungen'},
  add:        {en:'+ Add Asset', ar:'+ إضافة أصل', de:'+ Vermögenswert hinzufügen'},
  addTitle:   {en:'Add Asset', ar:'إضافة أصل', de:'Vermögenswert hinzufügen'},
  editTitle:  {en:'Edit Asset', ar:'تعديل الأصل', de:'Vermögenswert bearbeiten'},
  empty:      {en:'No assets yet', ar:'لا توجد أصول بعد', de:'Noch keine Vermögenswerte'},
  name:       {en:'Asset Name', ar:'اسم الأصل', de:'Bezeichnung'},
  vehicles:   {en:'Vehicles (from Fleet)', ar:'المركبات (من الأسطول)', de:'Fahrzeuge (aus Fuhrpark)'},
  general:    {en:'Other Assets', ar:'أصول أخرى', de:'Sonstige Vermögenswerte'},
  totalValue: {en:'Total Purchase Value', ar:'إجمالي قيمة الشراء', de:'Gesamter Anschaffungswert'},
  installHintThreshold: {en:'Tip: purchases over €1000 usually can\'t be expensed all at once in Austria — consider Ausschreibung below.', ar:'ملحوظة: المشتريات فوق ١٠٠٠ يورو غالبًا مايتحسبش مصروف كامل مرة واحدة في النمسا — استخدم Ausschreibung تحت.', de:'Hinweis: Anschaffungen über 1000€ können in Österreich meist nicht auf einmal abgesetzt werden — nutzen Sie unten die Ausschreibung.'},
  confirmDelete: {en:'Delete this asset?', ar:'حذف هذا الأصل؟', de:'Diesen Vermögenswert löschen?'},
  invalid:    {en:'Enter a name, price and purchase date', ar:'ادخل الاسم والسعر وتاريخ الشراء', de:'Bitte Name, Preis und Kaufdatum eingeben'},
  exportPdf:  {en:'Export PDF', ar:'تصدير PDF', de:'PDF exportieren'},
  disclaimer: {en:'For planning purposes only — not tax advice. Your accountant determines the official accounting treatment.',
               ar:'لأغراض التخطيط فقط — مش استشارة ضريبية. المحاسب بيحدد المعاملة المحاسبية الرسمية.',
               de:'Nur zu Planungszwecken — keine Steuerberatung. Ihr Steuerberater legt die offizielle buchhalterische Behandlung fest.'},
};










// ── INVENTORY (Retail) ──
var PRODUCT_L = {
  title:      {en:'Inventory', ar:'المخزون', de:'Lagerbestand'},
  add:        {en:'+ Add Product', ar:'+ إضافة منتج', de:'+ Produkt hinzufügen'},
  addTitle:   {en:'Add Product', ar:'إضافة منتج', de:'Produkt hinzufügen'},
  editTitle:  {en:'Edit Product', ar:'تعديل المنتج', de:'Produkt bearbeiten'},
  empty:      {en:'No products yet', ar:'لا توجد منتجات بعد', de:'Noch keine Produkte'},
  name:       {en:'Product Name', ar:'اسم المنتج', de:'Produktname'},
  description:{en:'Description (optional)', ar:'الوصف (اختياري)', de:'Beschreibung (optional)'},
  purchasePrice:{en:'Purchase Price', ar:'سعر الشراء', de:'Einkaufspreis'},
  sellPrice:  {en:'Sell Price', ar:'سعر البيع', de:'Verkaufspreis'},
  quantity:   {en:'Quantity', ar:'الكمية', de:'Menge'},
  unit:       {en:'Unit (pcs, kg, box...)', ar:'الوحدة (قطعة، كجم، كرتونة...)', de:'Einheit (Stk, kg, Karton...)'},
  lowStockThreshold: {en:'Low Stock Alert Below', ar:'تنبيه نفاد لو الكمية أقل من', de:'Warnung bei Bestand unter'},
  save:       {en:'Save', ar:'حفظ', de:'Speichern'},
  cancel:     {en:'Cancel', ar:'إلغاء', de:'Abbrechen'},
  confirmDelete: {en:'Delete this product?', ar:'حذف هذا المنتج؟', de:'Dieses Produkt löschen?'},
  invalid:    {en:'Enter a name, purchase price, sell price and quantity', ar:'ادخل الاسم وسعر الشراء وسعر البيع والكمية', de:'Bitte Name, Einkaufspreis, Verkaufspreis und Menge eingeben'},
  totalValue: {en:'Total Inventory Value', ar:'إجمالي قيمة المخزون', de:'Gesamter Lagerwert'},
  totalItems: {en:'Products', ar:'المنتجات', de:'Produkte'},
  lowStock:   {en:'Low Stock', ar:'قرب النفاد', de:'Niedriger Bestand'},
  outOfStock: {en:'Out of stock', ar:'نفدت الكمية', de:'Nicht auf Lager'},
  lowStockBadge: {en:'Low stock', ar:'قرب النفاد', de:'Niedriger Bestand'},
  exportPdf:  {en:'Export PDF', ar:'تصدير PDF', de:'PDF exportieren'},
  lowStockNotif: {en:' is low on stock: ', ar:' قرب ينفد: ', de:' hat niedrigen Bestand: '},
  outOfStockNotif: {en:' is out of stock', ar:' نفدت كميته', de:' ist nicht mehr auf Lager'},
  consume:    {en:'Use', ar:'استهلاك', de:'Verbrauchen'},
  consumeTitle: {en:'Record Usage', ar:'تسجيل استهلاك', de:'Verbrauch erfassen'},
  consumeQty: {en:'Quantity Used', ar:'الكمية المستهلكة', de:'Verbrauchte Menge'},
  consumeVehicle: {en:'Vehicle (optional)', ar:'العربية (اختياري)', de:'Fahrzeug (optional)'},
  consumeVehicleNone: {en:'No vehicle', ar:'بدون عربية', de:'Kein Fahrzeug'},
  consumeNote: {en:'Note (optional)', ar:'ملاحظة (اختياري)', de:'Notiz (optional)'},
  consumeInvalid: {en:'Enter a valid quantity', ar:'ادخل كمية صحيحة', de:'Bitte gültige Menge eingeben'},
  consumeExceeds: {en:'Not enough stock available', ar:'الكمية المتاحة غير كافية', de:'Nicht genug Bestand verfügbar'},
  consumeHistory: {en:'Recent Usage', ar:'آخر عمليات الاستهلاك', de:'Letzte Verbrauchseinträge'},
  consumeHistoryEmpty: {en:'No usage recorded yet', ar:'لا يوجد استهلاك مسجل بعد', de:'Noch kein Verbrauch erfasst'},
};
function invtx(k) { return (PRODUCT_L[k] && PRODUCT_L[k][state.lang]) || (PRODUCT_L[k] && PRODUCT_L[k].en) || k; }

function checkLowStock(prod) {
  if(!prod) return;
  var qty = parseFloat(prod.quantity) || 0;
  var threshold = parseFloat(prod.lowStockThreshold);
  if(isNaN(threshold) || qty > threshold) return;
  var sourceId = 'lowstock-' + prod.id + '-' + today();
  var already = state.notifications.some(function(n){ return n.sourceId === sourceId; });
  if(already) return;
  var lang = state.lang;
  var msg = prod.name + (qty <= 0 ? (invtx('outOfStockNotif')) : (invtx('lowStockNotif') + qty + ' ' + (prod.unit||'')));
  addNotification(msg, 'warning', sourceId);
}
function checkLowStockAll() {
  (state.inventory || []).forEach(function(p){ checkLowStock(p); });
}

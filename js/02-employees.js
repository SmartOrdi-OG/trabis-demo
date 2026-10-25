// ── EMPLOYEES PAGE ──
var EMP_L = {
  title:      {en:'Employees', ar:'الموظفون', de:'Mitarbeiter'},
  add:        {en:'+ Add Employee', ar:'+ إضافة موظف', de:'+ Mitarbeiter hinzufügen'},
  addTitle:   {en:'Add Employee', ar:'إضافة موظف', de:'Mitarbeiter hinzufügen'},
  empty:      {en:'No employees yet', ar:'لا يوجد موظفون بعد', de:'Noch keine Mitarbeiter'},
  fullName:   {en:'Full Name', ar:'الاسم الكامل', de:'Vollständiger Name'},
  position:   {en:'Position / Job Title', ar:'المنصب / الوظيفة', de:'Position / Berufsbezeichnung'},
  salary:     {en:'Monthly Salary (Brutto)', ar:'الراتب الشهري (Brutto)', de:'Monatsgehalt (Brutto)'},
  salaryNote: {en:'This is the gross (Brutto) salary, recorded automatically as a monthly expense. Net (Netto) pay and payroll deductions are calculated by your accountant (Lohnverrechnung).', ar:'ده الراتب الإجمالي (Brutto)، وبيتسجل تلقائيًا كمصروف شهري. صافي الراتب (Netto) والخصومات بيحسبها المحاسب (Lohnverrechnung).', de:'Dies ist das Bruttogehalt, wird automatisch als monatliche Ausgabe erfasst. Das Nettogehalt und die Abzüge werden von Ihrem Steuerberater (Lohnverrechnung) berechnet.'},
  phone:      {en:'Phone', ar:'الهاتف', de:'Telefon'},
  email:      {en:'Email', ar:'البريد الإلكتروني', de:'E-Mail'},
  address:    {en:'Address', ar:'العنوان', de:'Adresse'},
  nationality:{en:'Nationality', ar:'الجنسية', de:'Nationalität'},
  birthDate:  {en:'Birth Date', ar:'تاريخ الميلاد', de:'Geburtsdatum'},
  startDate:  {en:'Start Date', ar:'تاريخ البدء', de:'Startdatum'},
  notes:      {en:'Notes', ar:'ملاحظات', de:'Notizen'},
  notesPh:    {en:'Add notes...', ar:'أضف ملاحظات...', de:'Notizen hinzufügen...'},
  documents:  {en:'Documents', ar:'المستندات', de:'Dokumente'},
  workHours:  {en:'Work Hours', ar:'ساعات العمل', de:'Arbeitsstunden'},
  comingSoon: {en:'Coming in this update', ar:'قريباً في هذا التحديث', de:'Kommt in diesem Update'},
  save:       {en:'Save', ar:'حفظ', de:'Speichern'},
  cancel:     {en:'Cancel', ar:'إلغاء', de:'Abbrechen'},
  back:       {en:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px"><polyline points="15 18 9 12 15 6"/></svg> Back', ar:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px"><polyline points="9 18 15 12 9 6"/></svg> رجوع', de:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px"><polyline points="15 18 9 12 15 6"/></svg> Zurück'},
  edit:       {en:'Edit', ar:'تعديل', de:'Bearbeiten'},
  deleteBtn:  {en:'Delete Employee', ar:'حذف الموظف', de:'Mitarbeiter löschen'},
  confirmDelete: {en:'Delete this employee? This will stop the monthly salary auto-recording for this employee', ar:'حذف هذا الموظف؟ سيتوقف تسجيل الراتب الشهري التلقائي لهذا الموظف', de:'Diesen Mitarbeiter löschen? Die monatliche Gehaltserfassung wird gestoppt'},
  docCamera:  {en:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg> Camera', ar:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg> كاميرا', de:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg> Kamera'},
  docUpload:  {en:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg> Upload', ar:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg> رفع ملف', de:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg> Hochladen'},
  docNoDocs:  {en:'No documents yet', ar:'لا توجد مستندات بعد', de:'Noch keine Dokumente'},
  docNamePh:  {en:'Document name (e.g. Work Permit)', ar:'اسم المستند (مثال: تصريح عمل)', de:'Dokumentname (z.B. Arbeitserlaubnis)'},
  docExpiry:  {en:'Expiry date (optional)', ar:'تاريخ الانتهاء (اختياري)', de:'Ablaufdatum (optional)'},
  docSave:    {en:'Save Document', ar:'حفظ المستند', de:'Dokument speichern'},
  docCancel:  {en:'Cancel', ar:'إلغاء', de:'Abbrechen'},
  docExpiresOn: {en:'Expires', ar:'ينتهي في', de:'Läuft ab am'},
  docExpired: {en:'Expired', ar:'منتهي', de:'Abgelaufen'},
  docExpiresSoon: {en:'Expires soon', ar:'قريب الانتهاء', de:'Läuft bald ab'},
  confirmDeleteDoc: {en:'Delete this document?', ar:'حذف هذا المستند؟', de:'Dieses Dokument löschen?'},
  whAdd:      {en:'+ Add Entry', ar:'+ إضافة تسجيل', de:'+ Eintrag hinzufügen'},
  whEditTitle:{en:'Edit Entry', ar:'تعديل التسجيل', de:'Eintrag bearbeiten'},
  whAddTitle: {en:'Add Work Hours', ar:'إضافة ساعات عمل', de:'Arbeitszeit hinzufügen'},
  whFrom:     {en:'From', ar:'من', de:'Von'},
  whTo:       {en:'To', ar:'إلى', de:'Bis'},
  whStart:    {en:'Start Time (optional)', ar:'وقت البدء (اختياري)', de:'Beginn (optional)'},
  whEnd:      {en:'End Time (optional)', ar:'وقت الانتهاء (اختياري)', de:'Ende (optional)'},
  whBreak:    {en:'Break (minutes)', ar:'الاستراحة (دقيقة)', de:'Pause (Minuten)'},
  whHours:    {en:'Total Hours', ar:'إجمالي الساعات', de:'Gesamtstunden'},
  whHoursHint:{en:'Auto-filled from start/end time, or enter it directly', ar:'بيتحسب تلقائي من وقت البدء والانتهاء، أو اكتبه بنفسك', de:'Wird aus Beginn/Ende berechnet, oder direkt eingeben'},
  whNote:     {en:'Note (optional)', ar:'ملاحظة (اختياري)', de:'Notiz (optional)'},
  whNoEntries:{en:'No work hours logged yet', ar:'لا توجد ساعات عمل مسجلة بعد', de:'Noch keine Arbeitszeiten erfasst'},
  whThisMonth:{en:'This month', ar:'الشهر الحالي', de:'Diesen Monat'},
  whHoursShort:{en:'h', ar:'س', de:'Std'},
  whConfirmDelete: {en:'Delete this work hours entry?', ar:'هل تريد حذف هذا التسجيل؟', de:'Diesen Arbeitszeiteintrag löschen?'},
  whInvalid:  {en:'Enter a valid period and a total number of hours', ar:'ادخل فترة صحيحة وإجمالي عدد ساعات', de:'Bitte gültigen Zeitraum und Gesamtstunden eingeben'},
  whExportPdf: {en:'Export PDF', ar:'تصدير PDF', de:'PDF exportieren'},
  whNoEntriesMonth: {en:'No work hours logged this month', ar:'لا توجد ساعات عمل مسجلة هذا الشهر', de:'Keine Arbeitszeiten in diesem Monat erfasst'},
  whMonthTotal: {en:'Total this month', ar:'إجمالي الشهر', de:'Gesamt diesen Monat'},
  whAddLeave:   {en:'+ Krankenstand / Karenz', ar:'+ Krankenstand / Karenz', de:'+ Krankenstand / Karenz'},
  whLeaveTitle: {en:'Add Krankenstand / Karenz', ar:'إضافة Krankenstand / Karenz', de:'Krankenstand / Karenz hinzufügen'},
  whLeaveType:  {en:'Type', ar:'النوع', de:'Art'},
  whLeaveFrom:  {en:'From', ar:'من', de:'Von'},
  whLeaveTo:    {en:'To', ar:'إلى', de:'Bis'},
  whLeaveCert:  {en:'Certificate (optional)', ar:'الشهادة (اختياري)', de:'Nachweis (optional)'},
  whLeaveInvalid: {en:'Enter a valid date range (from must not be after to)', ar:'ادخل مدى تاريخ صحيح (تاريخ البداية لازم يكون قبل النهاية)', de:'Bitte gültigen Zeitraum eingeben (von darf nicht nach bis liegen)'},
  whLeaveConfirmDelete: {en:'Delete this Krankenstand/Karenz period? The affected days will become editable again.', ar:'حذف فترة الـ Krankenstand/Karenz دي؟ الأيام المتأثرة هترجع قابلة للتعديل تاني.', de:'Diesen Krankenstand-/Karenz-Zeitraum löschen? Die betroffenen Tage werden wieder bearbeitbar.'},
};
function emptx(k) { return (EMP_L[k] && EMP_L[k][state.lang]) || (EMP_L[k] && EMP_L[k].en) || k; }

function renderEmployeesPage() {
  var page = document.getElementById('employeesPage');
  if(!page) return;

  var h = '';
  h += '<div style="padding:16px 16px 0"><div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">';
  h += '<div style="display:flex;align-items:center;gap:8px">' + moreBackBtnHtml() + '<div style="font-size:18px;font-weight:700">' + emptx('title') + '</div></div>';
  h += '<button id="empAddBtn" style="background:#0061a4;color:#fff;border:none;border-radius:10px;padding:8px 14px;font-size:13px;font-weight:600;cursor:pointer">' + emptx('add') + '</button>';
  h += '</div></div>';

  h += '<div id="employeesPageBody" style="padding:0 16px 120px">';
  if(!state.employees.length) {
    h += '<div style="text-align:center;padding:60px 20px;color:var(--text3);font-size:14px">' + emptx('empty') + '</div>';
  } else {
    state.employees.forEach(function(e) {
      var displayName = e.fullName || e.name || '';
      var initial = displayName ? displayName.charAt(0).toUpperCase() : '?';
      var position = e.position || e.role || '';
      h += '<div class="emp-card" data-id="' + e.id + '" style="background:var(--card);border-radius:16px;padding:16px;margin-bottom:10px;display:flex;align-items:center;gap:14px;cursor:pointer;box-shadow:var(--shadow)">';
      h += '<div style="width:48px;height:48px;border-radius:50%;background:var(--primary);color:#fff;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:700;flex-shrink:0">' + escHtml(initial) + '</div>';
      h += '<div style="flex:1;min-width:0">';
      h += '<div style="font-size:15px;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + escHtml(displayName) + '</div>';
      h += '<div style="font-size:12px;color:var(--text3);margin-top:2px">' + (position ? escHtml(position) : '—') + '</div>';
      h += '<div style="font-size:13px;color:var(--income);font-weight:600;margin-top:2px">' + fmt(parseFloat(e.salary) || 0) + '/mo</div>';
      h += '</div>';
      h += svgIcon('chevronRight', 18);
      h += '</div>';
    });
  }
  h += '</div>';

  page.innerHTML = h;

  var addBtn = document.getElementById('empAddBtn');
  if(addBtn) addBtn.onclick = openAddEmployeeForm;

  var cards = page.querySelectorAll('.emp-card');
  var ci;
  for(ci = 0; ci < cards.length; ci++) {
    (function(card) {
      var id = parseInt(card.getAttribute('data-id'), 10);
      card.onclick = function(){ renderEmployeeProfile(id); };
    })(cards[ci]);
  }
}

function closeAddEmployeeForm() {
  var ov = document.getElementById('empAddOverlay');
  if(ov) ov.parentNode.removeChild(ov);
}

function openAddEmployeeForm() {
  var existing = document.getElementById('empAddOverlay');
  if(existing) existing.parentNode.removeChild(existing);

  var ov = document.createElement('div');
  ov.id = 'empAddOverlay';
  ov.className = 'modal-overlay open';

  var html = '';
  html += '<div class="modal" id="empAddModal">';
  html += '<button class="modal-close-btn" id="empAddCloseBtn">' + svgIcon('x', 16) + '</button>';
  html += '<div class="modal-handle"></div>';
  html += '<div class="modal-title">' + emptx('addTitle') + '</div>';
  html += '<input class="input-field" id="ea-fullname" placeholder="' + emptx('fullName') + ' *">';
  html += '<input class="input-field" id="ea-position" placeholder="' + emptx('position') + '">';
  html += '<input class="input-field" id="ea-salary" type="text" inputmode="decimal" oninput="sanitizeAmountField(this)" placeholder="' + emptx('salary') + ' *">';
  html += '<div style="font-size:11px;color:var(--text3);margin:-8px 0 12px">' + emptx('salaryNote') + '</div>';
  html += '<input class="input-field" id="ea-phone" type="tel" placeholder="' + emptx('phone') + '">';
  html += '<input class="input-field" id="ea-email" type="email" placeholder="' + emptx('email') + '">';
  html += '<label style="font-size:12px;color:var(--text3);display:block;margin-bottom:4px">' + emptx('startDate') + '</label>';
  html += '<div class="date-fix-wrap"><input class="input-field" id="ea-startdate" type="date"></div>';
  html += '<div style="display:flex;gap:10px;margin-top:10px">';
  html += '<button id="empAddSaveBtn" style="flex:1;background:var(--primary);color:#fff;border:none;border-radius:12px;padding:13px;font-size:15px;font-weight:700;cursor:pointer">' + emptx('save') + '</button>';
  html += '<button id="empAddCancelBtn" style="flex:1;background:var(--bg);color:var(--text2);border:1.5px solid var(--border);border-radius:12px;padding:13px;font-size:15px;font-weight:600;cursor:pointer">' + emptx('cancel') + '</button>';
  html += '</div>';
  html += '</div>';

  ov.innerHTML = html;
  document.body.appendChild(ov);

  var closeBtn = document.getElementById('empAddCloseBtn');
  if(closeBtn) closeBtn.onclick = closeAddEmployeeForm;
  var cancelBtn = document.getElementById('empAddCancelBtn');
  if(cancelBtn) cancelBtn.onclick = closeAddEmployeeForm;
  var saveBtn = document.getElementById('empAddSaveBtn');
  if(saveBtn) saveBtn.onclick = saveNewEmployee;
  ov.onclick = function(e) { if(e.target === ov) closeAddEmployeeForm(); };
}

function saveNewEmployee() {
  var nameEl = document.getElementById('ea-fullname');
  var name = nameEl ? nameEl.value.trim() : '';
  if(!name) { if(nameEl) nameEl.focus(); return; }
  var salaryEl = document.getElementById('ea-salary');
  var salary = salaryEl ? (parseAmount(salaryEl.value) || 0) : 0;
  var positionEl = document.getElementById('ea-position');
  var position = (positionEl && positionEl.value.trim()) || '';
  var phoneEl = document.getElementById('ea-phone');
  var emailEl = document.getElementById('ea-email');
  var startDateEl = document.getElementById('ea-startdate');

  state.employees.push({
    id: Date.now(),
    name: name,
    fullName: name,
    position: position,
    role: position,
    salary: salary,
    lastRecorded: '',
    birthDate: '',
    nationality: '',
    address: '',
    phone: (phoneEl && phoneEl.value.trim()) || '',
    email: (emailEl && emailEl.value.trim()) || '',
    startDate: (startDateEl && startDateEl.value) || '',
    notes: '',
    documents: [],
    workHours: [],
    leavePeriods: [],
  });
  save();
  closeAddEmployeeForm();
  renderEmployeesPage();
}

function empInfoRow(label, value) {
  return '<div style="margin-bottom:12px"><div style="font-size:12px;color:var(--text3);margin-bottom:2px">' + label + '</div><div style="font-size:14px;color:var(--text)">' + (value ? escHtml(value) : '—') + '</div></div>';
}

var _empProfileId = null;
var _empProfileEditMode = false;
var _whViewMonth = null;
var _fbViewMonth = null;

function closeEmployeeProfile() {
  var ov = document.getElementById('empProfileOverlay');
  if(ov) ov.parentNode.removeChild(ov);
  renderEmployeesPage();
}

function renderEmployeeProfileCard(emp) {
  var card = document.getElementById('empProfileCard');
  if(!card) return;

  var displayName = emp.fullName || emp.name || '';
  var initial = displayName ? displayName.charAt(0).toUpperCase() : '?';
  var position = emp.position || emp.role || '';

  if(!_empProfileEditMode) {
    var html = '';
    html += '<div style="display:flex;align-items:center;gap:14px;margin-bottom:18px">';
    html += '<div style="width:64px;height:64px;border-radius:50%;background:var(--primary);color:#fff;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:700;flex-shrink:0">' + escHtml(initial) + '</div>';
    html += '<div><div style="font-size:18px;font-weight:700">' + escHtml(displayName) + '</div>';
    html += '<div style="font-size:13px;color:var(--text3);margin-top:2px">' + (position ? escHtml(position) : '—') + '</div></div>';
    html += '</div>';

    html += empInfoRow(emptx('phone'), emp.phone);
    html += empInfoRow(emptx('email'), emp.email);
    html += empInfoRow(emptx('address'), emp.address);
    html += empInfoRow(emptx('nationality'), emp.nationality);
    html += empInfoRow(emptx('birthDate'), emp.birthDate ? formatDateDisplay(emp.birthDate) : '');
    html += empInfoRow(emptx('startDate'), emp.startDate ? formatDateDisplay(emp.startDate) : '');

    html += '<div><div style="font-size:12px;color:var(--text3);margin-bottom:2px">' + emptx('salary') + '</div><div style="font-size:16px;font-weight:700;color:var(--income)">' + fmt(parseFloat(emp.salary) || 0) + '/mo</div></div>';

    card.innerHTML = html;
  } else {
    var eh = '';
    eh += '<div style="margin-bottom:12px"><label style="font-size:12px;color:var(--text3);display:block;margin-bottom:4px">' + emptx('fullName') + '</label><input id="epf-fullname" class="input-field" style="margin-bottom:0" value="' + escHtml(displayName) + '"></div>';
    eh += '<div style="margin-bottom:12px"><label style="font-size:12px;color:var(--text3);display:block;margin-bottom:4px">' + emptx('position') + '</label><input id="epf-position" class="input-field" style="margin-bottom:0" value="' + escHtml(position) + '"></div>';
    eh += '<div style="margin-bottom:12px"><label style="font-size:12px;color:var(--text3);display:block;margin-bottom:4px">' + emptx('phone') + '</label><input id="epf-phone" type="tel" class="input-field" style="margin-bottom:0" value="' + escHtml(emp.phone || '') + '"></div>';
    eh += '<div style="margin-bottom:12px"><label style="font-size:12px;color:var(--text3);display:block;margin-bottom:4px">' + emptx('email') + '</label><input id="epf-email" type="email" class="input-field" style="margin-bottom:0" value="' + escHtml(emp.email || '') + '"></div>';
    eh += '<div style="margin-bottom:12px"><label style="font-size:12px;color:var(--text3);display:block;margin-bottom:4px">' + emptx('address') + '</label><input id="epf-address" class="input-field" style="margin-bottom:0" value="' + escHtml(emp.address || '') + '"></div>';
    eh += '<div style="margin-bottom:12px"><label style="font-size:12px;color:var(--text3);display:block;margin-bottom:4px">' + emptx('nationality') + '</label><input id="epf-nationality" class="input-field" style="margin-bottom:0" value="' + escHtml(emp.nationality || '') + '"></div>';
    eh += '<div style="margin-bottom:12px"><label style="font-size:12px;color:var(--text3);display:block;margin-bottom:4px">' + emptx('birthDate') + '</label><div class="date-fix-wrap" style="margin-bottom:0"><input id="epf-birthdate" type="date" class="input-field" style="margin-bottom:0" value="' + (emp.birthDate || '') + '"></div></div>';
    eh += '<div style="margin-bottom:12px"><label style="font-size:12px;color:var(--text3);display:block;margin-bottom:4px">' + emptx('startDate') + '</label><div class="date-fix-wrap" style="margin-bottom:0"><input id="epf-startdate" type="date" class="input-field" style="margin-bottom:0" value="' + (emp.startDate || '') + '"></div></div>';
    eh += '<div style="margin-bottom:14px"><label style="font-size:12px;color:var(--text3);display:block;margin-bottom:4px">' + emptx('salary') + '</label><input id="epf-salary" type="text" inputmode="decimal" oninput="sanitizeAmountField(this)" class="input-field" style="margin-bottom:4px" value="' + (parseFloat(emp.salary) || 0) + '"><div style="font-size:11px;color:var(--text3)">' + emptx('salaryNote') + '</div></div>';
    eh += '<div style="display:flex;gap:10px">';
    eh += '<button id="epf-saveBtn" style="flex:1;background:var(--primary);color:#fff;border:none;border-radius:10px;padding:11px;font-size:14px;font-weight:700;cursor:pointer">' + emptx('save') + '</button>';
    eh += '<button id="epf-cancelBtn" style="flex:1;background:var(--bg);color:var(--text2);border:1.5px solid var(--border);border-radius:10px;padding:11px;font-size:14px;cursor:pointer">' + emptx('cancel') + '</button>';
    eh += '</div>';
    card.innerHTML = eh;

    var saveBtn = document.getElementById('epf-saveBtn');
    if(saveBtn) saveBtn.onclick = function() {
      var nameEl = document.getElementById('epf-fullname');
      var newName = nameEl.value.trim();
      if(!newName) { nameEl.focus(); return; }
      emp.name = newName;
      emp.fullName = newName;
      var newPos = document.getElementById('epf-position').value.trim();
      emp.position = newPos;
      emp.role = newPos;
      emp.phone = document.getElementById('epf-phone').value.trim();
      emp.email = document.getElementById('epf-email').value.trim();
      emp.address = document.getElementById('epf-address').value.trim();
      emp.nationality = document.getElementById('epf-nationality').value.trim();
      emp.birthDate = document.getElementById('epf-birthdate').value;
      emp.startDate = document.getElementById('epf-startdate').value;
      emp.salary = parseAmount(document.getElementById('epf-salary').value) || 0;
      save();
      _empProfileEditMode = false;
      renderEmployeeProfileCard(emp);
      var titleEl = document.getElementById('empProfileTitle');
      if(titleEl) titleEl.textContent = emp.fullName;
    };
    var cancelBtn = document.getElementById('epf-cancelBtn');
    if(cancelBtn) cancelBtn.onclick = function() {
      _empProfileEditMode = false;
      renderEmployeeProfileCard(emp);
    };
  }
}

function renderEmployeeProfile(id) {
  var found = state.employees.filter(function(e){ return e.id === id; });
  if(!found.length) return;
  var emp = found[0];
  _empProfileId = id;
  _empProfileEditMode = false;
  _whViewMonth = today().substring(0,7);

  var existingOv = document.getElementById('empProfileOverlay');
  if(existingOv) existingOv.parentNode.removeChild(existingOv);

  var displayName = emp.fullName || emp.name || '';

  var ov = document.createElement('div');
  ov.id = 'empProfileOverlay';
  ov.style.cssText = 'position:fixed;inset:0;z-index:9999;background:var(--bg);overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch';

  var html = '';
  html += '<div style="position:sticky;top:0;z-index:10;background:var(--card);padding:14px 16px;display:flex;align-items:center;gap:12px;border-bottom:1px solid var(--border)">';
  html += '<button id="empBackBtn" style="background:none;border:none;color:var(--text);font-size:15px;cursor:pointer;padding:4px">' + emptx('back') + '</button>';
  html += '<div id="empProfileTitle" style="flex:1;font-size:16px;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + escHtml(displayName) + '</div>';
  html += '<button id="empEditBtn" style="background:none;border:none;color:var(--primary);font-size:14px;font-weight:700;cursor:pointer;padding:4px">' + emptx('edit') + '</button>';
  html += '</div>';

  html += '<div style="padding:16px">';
  html += '<div id="empProfileCard" style="background:var(--card);border-radius:16px;padding:20px;margin-bottom:14px;box-shadow:var(--shadow)"></div>';

  html += '<div style="background:var(--card);border-radius:16px;padding:16px;margin-bottom:14px;box-shadow:var(--shadow)">';
  html += '<div style="font-size:15px;font-weight:700;margin-bottom:8px">' + emptx('documents') + '</div>';
  html += '<div id="empDocList"></div>';
  html += '<div style="display:flex;gap:8px;margin-top:10px">';
  html += '<button onclick="document.getElementById(\'empDocCameraInput\').click()" style="flex:1;padding:10px;border-radius:10px;border:1.5px dashed var(--border);background:var(--bg);color:var(--text2);font-size:13px;font-weight:600;cursor:pointer">' + emptx('docCamera') + '</button>';
  html += '<button onclick="document.getElementById(\'empDocFileInput\').click()" style="flex:1;padding:10px;border-radius:10px;border:1.5px dashed var(--border);background:var(--bg);color:var(--text2);font-size:13px;font-weight:600;cursor:pointer">' + emptx('docUpload') + '</button>';
  html += '</div>';
  html += '<input type="file" id="empDocCameraInput" accept="image/*" capture="environment" style="display:none" onchange="empDocFileChosen(this,' + id + ')">';
  html += '<input type="file" id="empDocFileInput" accept="image/*,application/pdf" style="display:none" onchange="empDocFileChosen(this,' + id + ')">';
  html += '</div>';

  html += '<div style="background:var(--card);border-radius:16px;padding:16px;margin-bottom:14px;box-shadow:var(--shadow)">';
  html += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">';
  html += '<div style="font-size:15px;font-weight:700">' + emptx('workHours') + '</div>';
  html += '<button onclick="whOpenMonthSheet(' + id + ')" style="background:none;border:none;color:var(--primary);font-size:13px;font-weight:700;cursor:pointer;padding:4px">' + emptx('whAdd') + '</button>';
  html += '</div>';
  html += '<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px">';
  html += '<button id="whPrevMonthBtn" style="background:var(--bg);border:1px solid var(--border);border-radius:8px;width:32px;height:32px;color:var(--text2);cursor:pointer;flex-shrink:0">' + svgIcon('chevronLeft', 14) + '</button>';
  html += '<div id="whMonthLabel" style="font-size:14px;font-weight:700;flex:1;text-align:center"></div>';
  html += '<button id="whNextMonthBtn" style="background:var(--bg);border:1px solid var(--border);border-radius:8px;width:32px;height:32px;color:var(--text2);cursor:pointer;flex-shrink:0">' + svgIcon('chevronRight', 14) + '</button>';
  html += '</div>';
  html += '<div id="whSummary" style="font-size:13px;color:var(--text3);margin-bottom:8px"></div>';
  html += '<div id="whList"></div>';
  html += '<button id="whExportBtn" style="width:100%;margin-top:10px;padding:10px;border-radius:10px;border:1.5px solid var(--border);background:var(--bg);color:var(--text2);font-size:13px;font-weight:600;cursor:pointer">' + svgIcon('download', 13) + ' ' + emptx('whExportPdf') + '</button>';
  html += '</div>';

  html += '<div style="background:var(--card);border-radius:16px;padding:16px;margin-bottom:14px;box-shadow:var(--shadow)">';
  html += '<div style="font-size:15px;font-weight:700;margin-bottom:8px">' + emptx('notes') + '</div>';
  html += '<textarea id="empNotesArea" placeholder="' + emptx('notesPh') + '" rows="4" style="width:100%;border:1.5px solid var(--border);border-radius:10px;padding:10px;background:var(--bg);color:var(--text);font-size:13px;font-family:inherit;resize:vertical;box-sizing:border-box">' + escHtml(emp.notes || '') + '</textarea>';
  html += '</div>';

  html += '<button id="empDeleteBtn" style="width:100%;background:rgba(239,68,68,0.1);color:#ef4444;border:none;border-radius:12px;padding:13px;font-size:14px;font-weight:700;cursor:pointer;margin-top:6px">' + svgIcon('trash', 15) + ' ' + emptx('deleteBtn') + '</button>';
  html += '</div>';

  ov.innerHTML = html;
  document.body.appendChild(ov);

  renderEmployeeProfileCard(emp);
  renderEmpDocsSection(emp);
  renderWorkHoursSection(emp);

  var backBtn = document.getElementById('empBackBtn');
  if(backBtn) backBtn.onclick = closeEmployeeProfile;
  var editBtn = document.getElementById('empEditBtn');
  if(editBtn) editBtn.onclick = function() {
    _empProfileEditMode = true;
    renderEmployeeProfileCard(emp);
  };

  var notesArea = document.getElementById('empNotesArea');
  if(notesArea) {
    notesArea.onblur = function() {
      emp.notes = notesArea.value;
      save();
    };
  }

  var deleteBtn = document.getElementById('empDeleteBtn');
  if(deleteBtn) deleteBtn.onclick = async function() {
    if(!(await confirmAsync(DELETE_CONFIRM_TITLE[state.lang]||DELETE_CONFIRM_TITLE.en, emptx('confirmDelete')))) return;
    (emp.documents || []).forEach(function(d){ empDocDeleteRec(d.id); });
    state.employees = state.employees.filter(function(x){ return x.id !== id; });
    save();
    var ovEl = document.getElementById('empProfileOverlay');
    if(ovEl) ovEl.parentNode.removeChild(ovEl);
    renderEmployeesPage();
  };
}

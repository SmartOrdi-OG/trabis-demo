// ── SETTINGS ──
function setLang(val) {
  state.lang = val;
  save();
  applyLang();
  renderHome();
  if(document.getElementById('settingsPage').style.display !== 'none') renderSettings();
}

function applyLang() {
  var isRTL = state.lang === 'ar';
  setTimeout(artSyncTopbar, 0);
  document.documentElement.lang = state.lang;
  document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  if(isRTL) { document.body.classList.add('lang-ar'); } else { document.body.classList.remove('lang-ar'); }
  document.body.style.fontFamily = isRTL ? '"SF Arabic",Arial,sans-serif' : '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif';

  // Update nav labels
  var navKeys = ['home'];
  navKeys.forEach(function(k) {
    var el = document.querySelector('#nav-'+k+' .bnav-label');
    if(el) el.textContent = t(k);
  });
  var agendaNavLbl = document.getElementById('nav-agenda-lbl');
  if(agendaNavLbl) agendaNavLbl.textContent = {en:'Daily Log',ar:'سجل الأعمال اليومي',de:'Tagesprotokoll'}[state.lang]||'Daily Log';
  var empNavLbl = document.getElementById('nav-employees-lbl');
  if(empNavLbl) empNavLbl.textContent = {en:'Employees',ar:'الموظفين',de:'Mitarbeiter'}[state.lang]||'Employees';
  var moreNavLbl = document.getElementById('nav-more-lbl');
  if(moreNavLbl) moreNavLbl.textContent = t('more');

  // Update dashboard summary card labels
  var dashIncomeLbl = document.getElementById('dashIncomeLbl');
  if(dashIncomeLbl) dashIncomeLbl.textContent = {en:'Income', ar:'الدخل', de:'Einnahmen'}[state.lang] || 'Income';
  var dashExpenseLbl = document.getElementById('dashExpenseLbl');
  if(dashExpenseLbl) dashExpenseLbl.textContent = {en:'Expenses', ar:'المصروفات', de:'Ausgaben'}[state.lang] || 'Expenses';
  var dashExpenseNettoLbl = document.getElementById('dashExpenseNettoLbl');
  if(dashExpenseNettoLbl) dashExpenseNettoLbl.textContent = {en:'Net', ar:'الصافي', de:'Netto'}[state.lang] || 'Net';
  var dashExpenseVatLbl = document.getElementById('dashExpenseVatLbl');
  if(dashExpenseVatLbl) dashExpenseVatLbl.textContent = {en:'VAT', ar:'الضريبة', de:'MwSt.'}[state.lang] || 'VAT';
  var dashIncomeNettoLbl = document.getElementById('dashIncomeNettoLbl');
  if(dashIncomeNettoLbl) dashIncomeNettoLbl.textContent = {en:'Net', ar:'الصافي', de:'Netto'}[state.lang] || 'Net';
  var dashIncomeVatLbl = document.getElementById('dashIncomeVatLbl');
  if(dashIncomeVatLbl) dashIncomeVatLbl.textContent = {en:'VAT', ar:'الضريبة', de:'MwSt.'}[state.lang] || 'VAT';

  // Update mobile Quick Add card labels
  var mqaIncomeLbl = document.getElementById('mqa-lbl-income');
  if(mqaIncomeLbl) mqaIncomeLbl.textContent = t('income');
  var mqaExpenseLbl = document.getElementById('mqa-lbl-expense');
  if(mqaExpenseLbl) mqaExpenseLbl.textContent = t('expense');
  var mqaDebtLbl = document.getElementById('mqa-lbl-debt');
  if(mqaDebtLbl) mqaDebtLbl.textContent = t('debts');
  var mqaInvoiceLbl = document.getElementById('mqa-lbl-invoice');
  if(mqaInvoiceLbl) mqaInvoiceLbl.textContent = {en:'Invoice', ar:'فاتورة', de:'Rechnung'}[state.lang] || 'Invoice';

  renderMonthTabs();
  var modeSingleBtn = document.getElementById('customModeSingleBtn');
  if(modeSingleBtn) modeSingleBtn.textContent = t('singleDay');
  var modeRangeBtn = document.getElementById('customModeRangeBtn');
  if(modeRangeBtn) modeRangeBtn.textContent = t('dateRange');
  var fromLblEl = document.getElementById('customFromLbl');
  if(fromLblEl) fromLblEl.textContent = t('fromDate');
  var toLblEl = document.getElementById('customToLbl');
  if(toLblEl) toLblEl.textContent = t('toDate');
  var applyBtnEl = document.getElementById('customApplyBtn');
  if(applyBtnEl) applyBtnEl.textContent = t('apply');
  var cancelBtnEl = document.getElementById('customCancelBtn');
  if(cancelBtnEl) cancelBtnEl.textContent = t('cancel');
  renderCustomDateActiveBar();

  // Update language label in settings
  var lblLang = document.getElementById('lbl-lang');
  if(lblLang) lblLang.textContent = t('language');
  var lblLangSub = document.getElementById('lbl-lang-sub');
  if(lblLangSub) lblLangSub.textContent = t('selectLang');

  // Update logo sub
  var logoSub = document.querySelector('.logo-sub');
  if(logoSub) logoSub.textContent = t('appSub');

  // Update lang select
  var ls = document.getElementById('langSelect');
  if(ls) ls.value = state.lang;
  // Chart labels in reports
  var rptChartTitle = document.getElementById('rpt-chart-title');
  if(rptChartTitle) rptChartTitle.textContent = {en:'Last 7 Days', ar:'آخر 7 أيام', de:'Letzte 7 Tage'}[state.lang]||'Last 7 Days';
  var rptIncLbl = document.getElementById('rpt-income-lbl');
  if(rptIncLbl) rptIncLbl.textContent = t('income');
  var rptExpLbl = document.getElementById('rpt-expense-lbl');
  if(rptExpLbl) rptExpLbl.textContent = t('expense');

  // Translate static empty state messages
  var noTxEl = document.getElementById('noTxMsg');
  if(noTxEl) noTxEl.innerHTML = t('noTx').replace('\n','<br/>');
  var noDebtsEl = document.getElementById('noDebtsMsg');
  if(noDebtsEl) noDebtsEl.textContent = t('noDebts').split('\n')[0];
  // Update debt tabs labels
  var debtTabOwes = document.getElementById('debt-tab-owes');
  var debtTabIowe = document.getElementById('debt-tab-iowe');
  var credLbl = {en:'Creditors (owed to me)', ar:'دائن (لي)', de:'Gläubiger'};
  var debtLbl = {en:'Debtors (I owe)', ar:'مدين (عليّ)', de:'Schuldner'};
  if(debtTabOwes) debtTabOwes.innerHTML = svgIcon('money',12) + ' ' + escHtml(credLbl[state.lang]||credLbl.en);
  if(debtTabIowe) debtTabIowe.innerHTML = svgIcon('money',12) + ' ' + escHtml(debtLbl[state.lang]||debtLbl.en);
  var rptNavLbl = document.getElementById('nav-reports-lbl');
  if(rptNavLbl) rptNavLbl.textContent = {en:'Reports',ar:'التقارير',de:'Berichte'}[state.lang]||'Reports';
  var supNavLbl = document.getElementById('nav-suppliers-lbl');
  if(supNavLbl) supNavLbl.textContent = {en:'Suppliers',ar:'الموردون',de:'Lieferanten'}[state.lang]||'Suppliers';
  var fixNavLbl = document.getElementById('nav-fixed-lbl');
  if(fixNavLbl) fixNavLbl.textContent = {en:'Fixed',ar:'ثابت',de:'Fix'}[state.lang]||'Fixed';
  var invLbl = document.getElementById('invoiceLabel');
  if(invLbl) invLbl.textContent = t('attachInvoice');

  // Update currency select
  var cs = document.getElementById('currencySelect');
  if(cs) {
    // Update translated option labels
    var curOpts = [
      {v:'€',  en:'Euro €',       ar:'يورو €',            de:'Euro €'},
      {v:'$',  en:'Dollar $',     ar:'دولار $',           de:'Dollar $'},
      {v:'£',  en:'Pound £',      ar:'جنيه إسترليني £',  de:'Pfund £'},
      {v:'E£', en:'Pound E£',     ar:'جنيه مصري E£',     de:'Äg. Pfund E£'},
      {v:'﷼',  en:'Riyal ﷼',     ar:'ريال ﷼',           de:'Riyal ﷼'},
      {v:'د.إ',en:'Dirham د.إ',  ar:'درهم د.إ',          de:'Dirham د.إ'},
    ];
    Array.prototype.forEach.call(cs.options, function(opt) {
      var found = curOpts.filter(function(c){return c.v===opt.value;})[0];
      if(found) opt.text = found[state.lang]||found.en;
    });
    cs.value = state.currency;
  }
  // Update report period pills
  updateRptPeriodPills();

  // Update settings page
  var ids = {
    'settings-title': t('settings'),
    'settings-general': t('general').toUpperCase(),
    'settings-data': t('data').toUpperCase(),
    'lbl-clear': t('clearData'),
    'lbl-clear-sub': t('cannotUndo'),
    'lbl-lang': t('language'),

    'lbl-lang-sub': t('selectLang'),
    'lbl-currency': t('currency'),
    'lbl-currency-sub': t('selectCurrency'),
    'lbl-plan': t('freePlan'),
    'lbl-upgrade': t('upgradeTeam'),
  };
  Object.entries(ids).forEach(function(entry){ var id=entry[0], val=entry[1];
    var el = document.getElementById(id);
    if(el) el.textContent = val;
  });

  // Update reports page titles
  var rTitle = document.querySelector('#reportsPage > div');
  if(rTitle) rTitle.textContent = t('reports');
  var dTitle = document.getElementById('debts-page-title');
  if(dTitle) dTitle.textContent = t('debts');
  var stTitle = document.getElementById('settings-title');
  if(stTitle) stTitle.textContent = t('settings');

  // Update debt tabs
  updateDebtTabs();

  // Update sidebar nav labels
  var snavLabels = {home:t('home'),reports:t('reports'),debts:t('debts'),invoices:t('invoices'),settings:t('settings')};
  snavLabels.clients = {en:'Clients',ar:'العملاء',de:'Kunden'}[state.lang]||'Clients';
  snavLabels.suppliers = {en:'Suppliers',ar:'الموردون',de:'Lieferanten'}[state.lang]||'Suppliers';
  snavLabels.fixed = {en:'Fixed',ar:'ثابت',de:'Fix'}[state.lang]||'Fixed';
  snavLabels.employees = {en:'Employees',ar:'الموظفين',de:'Mitarbeiter'}[state.lang]||'Employees';
  snavLabels.fleet = {en:'Fleet',ar:'الأسطول',de:'Fuhrpark'}[state.lang]||'Fleet';
  snavLabels.inventory = {en:'Inventory',ar:'المخزون',de:'Lagerbestand'}[state.lang]||'Inventory';
  snavLabels.assets = {en:'Assets',ar:'الأصول',de:'Vermögenswerte'}[state.lang]||'Assets';
  snavLabels.kalender = {en:'Calendar',ar:'التقويم',de:'Kalender'}[state.lang]||'Calendar';
  snavLabels.notizen = {en:'Notes',ar:'الملاحظات',de:'Notizen'}[state.lang]||'Notes';
  snavLabels.archive = {en:'Archive',ar:'الأرشيف',de:'Archiv'}[state.lang]||'Archive';
  snavLabels.contacts = {en:'Contacts',ar:'جهات الاتصال',de:'Kontakte'}[state.lang]||'Contacts';
  snavLabels.agenda = {en:'Daily Log',ar:'سجل الأعمال اليومي',de:'Tagesprotokoll'}[state.lang]||'Daily Log';
  snavLabels.help = {en:'Help',ar:'مساعدة',de:'Hilfe'}[state.lang]||'Help';
  snavLabels.gov = hptx('navGov');
  snavLabels.projects = hptx('navPrj');
  Object.keys(snavLabels).forEach(function(k){
    var el = document.getElementById('snav-lbl-'+k);
    if(el) el.textContent = snavLabels[k];
  });
  var snavGroupManage = document.getElementById('snav-group-manage');
  if(snavGroupManage) snavGroupManage.textContent = mtx('manage');
  var snavGroupTools = document.getElementById('snav-group-tools');
  if(snavGroupTools) snavGroupTools.textContent = mtx('tools');
  var snavGroupSupport = document.getElementById('snav-group-support');
  if(snavGroupSupport) snavGroupSupport.textContent = mtx('support');
  // Update sidebar user label
  var snavUser = document.getElementById('snav-user-lbl');
  var sUser = localStorage.getItem('smartac_user') || '';
  if(snavUser && sUser) {
    var helloLbl = state.lang==='ar'?'مرحباً، ':state.lang==='de'?'Hallo, ':'Hello, ';
    snavUser.textContent = helloLbl + sUser;
  }
  updatePrivacyTexts();
  updateBusinessNameDisplay();
}

var SETTINGS_L = {
  account:      {en:'Account & Profile', ar:'الحساب والملف الشخصي', de:'Konto & Profil'},
  bizNameLbl:   {en:'Business / Username', ar:'اسم العمل / المستخدم', de:'Firmen-/Benutzername'},
  changePw:     {en:'Change Password', ar:'تغيير كلمة المرور', de:'Passwort ändern'},
  logoutBtn:    {en:'Logout', ar:'تسجيل الخروج', de:'Abmelden'},
  hello:        {en:'Hello, ', ar:'مرحباً، ', de:'Hallo, '},
  logoTitle:    {en:'Business Logo', ar:'شعار العمل التجاري', de:'Firmenlogo'},
  removeLogo:   {en:'Remove Logo', ar:'إزالة الشعار', de:'Logo entfernen'},
  uploadLogo:   {en:'Upload Logo', ar:'رفع الشعار', de:'Logo hochladen'},
  chooseFile:   {en:'Choose File', ar:'اختر ملف', de:'Datei auswählen'},
  logoHelper:   {en:'Recommended: square image, max 2MB', ar:'يفضل: صورة مربعة، الحد الأقصى 2 ميجابايت', de:'Empfohlen: quadratisches Bild, max. 2 MB'},

  profileFullName:  {en:'Full Name', ar:'الاسم الكامل', de:'Vollständiger Name'},
  profileUsername:  {en:'Username', ar:'اسم المستخدم', de:'Benutzername'},
  profileUsernameNote: {en:'Username cannot be changed', ar:'لا يمكن تغيير اسم المستخدم', de:'Der Benutzername kann nicht geändert werden'},
  profileEmail:     {en:'Email', ar:'البريد الإلكتروني', de:'E-Mail'},
  profilePhone:     {en:'Phone Number', ar:'رقم الهاتف', de:'Telefonnummer'},
  profileCountry:   {en:'Country', ar:'الدولة', de:'Land'},
  bizTypeLbl:       {en:'Business Type', ar:'نوع النشاط', de:'Unternehmensart'},
  bizTypeNote:      {en:'Changing this shows/hides the matching tools (e.g. Fleet, Inventory). Your data is kept either way.', ar:'تغيير النوع بيظهر/يخفي الأدوات المرتبطة بيه (زي الأسطول أو المخزون). بياناتك بتفضل محفوظة في الحالتين.', de:'Diese Änderung zeigt/verbirgt die passenden Tools (z. B. Fuhrpark, Lagerbestand). Ihre Daten bleiben in jedem Fall erhalten.'},
  bizTypeChangeConfirm: {en:'Change business type? Tools for the previous type stay hidden but your existing data is not deleted.', ar:'هل تريد تغيير نوع النشاط؟ ستُخفى أدوات النوع السابق، لكن بياناته لن تُحذف.', de:'Unternehmensart ändern? Tools der vorherigen Art werden ausgeblendet, Ihre Daten bleiben aber erhalten.'},
  bizTypeGeneral:      {en:'General / Freelancer', ar:'عام / فريلانسر', de:'Allgemein / Freelancer'},
  bizTypeTransport:    {en:'Transport / Logistics', ar:'نقل وخدمات', de:'Transport / Logistik'},
  bizTypeRetail:       {en:'Retail / Shop', ar:'محل / تجزئة', de:'Einzelhandel / Shop'},
  bizTypeRestaurant:   {en:'Restaurant / Café', ar:'مطعم / كافيه', de:'Restaurant / Café'},
  bizTypeConstruction: {en:'Construction', ar:'مقاولات', de:'Bau / Handwerk'},
  bizTypeMedical:      {en:'Medical / Clinic', ar:'طبي / عيادة', de:'Medizin / Klinik'},
  verifyPwTitle:    {en:'Confirm Password', ar:'تأكيد كلمة المرور', de:'Passwort bestätigen'},
  verifyPwSub:      {en:'Enter your password to confirm these changes', ar:'أدخل كلمة المرور لتأكيد هذه التغييرات', de:'Geben Sie Ihr Passwort ein, um diese Änderungen zu bestätigen'},
  verifyPwConfirmBtn: {en:'Confirm', ar:'تأكيد', de:'Bestätigen'},
  verifyPwWrong:    {en:'Incorrect password', ar:'كلمة المرور غير صحيحة', de:'Falsches Passwort'},

  bizInfo:      {en:'Business Info', ar:'معلومات العمل', de:'Geschäftsinformationen'},
  bizAddress:   {en:'Company Address', ar:'عنوان الشركة', de:'Firmenadresse'},
  bizTaxId:     {en:'UID-Nummer / Tax ID', ar:'الرقم الضريبي', de:'UID-Nummer / Steuernummer'},
  bizPhone:     {en:'Business Phone', ar:'هاتف العمل', de:'Geschäftstelefon'},
  bizEmail:     {en:'Business Email', ar:'البريد الإلكتروني للعمل', de:'Geschäfts-E-Mail'},
  bizInfoNote:  {en:'This information appears on your invoices and receipts', ar:'تظهر هذه المعلومات في فواتيرك وإيصالاتك', de:'Diese Informationen erscheinen auf Ihren Rechnungen und Belegen'},
  bankSectionTitle:{en:'Bank Account', ar:'الحساب البنكي', de:'Bankkonto'},
  bankName:     {en:'Bank Name', ar:'اسم البنك', de:'Bankname'},
  bankIban:     {en:'IBAN', ar:'آيبان', de:'IBAN'},
  bankBic:      {en:'BIC/SWIFT', ar:'BIC/SWIFT', de:'BIC/SWIFT'},
  bankHolder:   {en:'Account Holder Name', ar:'اسم صاحب الحساب', de:'Name des Kontoinhabers'},
  editBtn:      {en:'Edit', ar:'تعديل', de:'Bearbeiten'},
  saveBtn:      {en:'Save', ar:'حفظ', de:'Speichern'},
  cancelBtn:    {en:'Cancel', ar:'إلغاء', de:'Abbrechen'},

  invoiceTplTitle: {en:'Invoice Template', ar:'شكل الفاتورة', de:'Rechnungsvorlage'},
  invoiceTplNote:  {en:'Choose how your issued and received invoices look when exported as PDF', ar:'اختر شكل الفواتير الصادرة والواردة عند تصديرها كـ PDF', de:'Wählen Sie, wie Ihre ausgestellten und erhaltenen Rechnungen als PDF aussehen'},
  tplClassic:      {en:'Classic', ar:'كلاسيك', de:'Klassisch'},
  tplModern:       {en:'Modern', ar:'مودرن', de:'Modern'},

  prefsTitle:   {en:'App Preferences', ar:'تفضيلات التطبيق', de:'App-Einstellungen'},
  dateFormat:   {en:'Date Format', ar:'تنسيق التاريخ', de:'Datumsformat'},
  dateFormatSub:{en:'Display format for dates', ar:'تنسيق عرض التاريخ', de:'Anzeigeformat für Daten'},

  dataMgmt:     {en:'Data Management', ar:'إدارة البيانات', de:'Datenverwaltung'},
  exportBackup: {en:'Export Backup (JSON)', ar:'تصدير نسخة احتياطية (JSON)', de:'Backup exportieren (JSON)'},
  importBackup: {en:'Import Backup', ar:'استيراد نسخة احتياطية', de:'Backup importieren'},
  clearAllData: {en:'Clear All Data', ar:'مسح كل البيانات', de:'Alle Daten löschen'},
  dataSize:     {en:'Approx. ', ar:'تقريباً ', de:'Ca. '},
  dataSizeUsed: {en:' KB used', ar:' كيلوبايت مستخدم', de:' KB verwendet'},
  importConfirm:{en:'This will overwrite your current data with the imported backup. Continue?', ar:'سيتم استبدال بياناتك الحالية بالنسخة الاحتياطية المستوردة. متابعة؟', de:'Dies überschreibt Ihre aktuellen Daten mit dem importierten Backup. Fortfahren?'},
  importInvalid:{en:'Invalid backup file.', ar:'ملف النسخة الاحتياطية غير صالح.', de:'Ungültige Backup-Datei.'},
  importSuccess:{en:'Backup imported successfully.', ar:'تم استيراد النسخة الاحتياطية بنجاح.', de:'Backup erfolgreich importiert.'},

  notifTitle:   {en:'Notifications', ar:'الإشعارات', de:'Benachrichtigungen'},
  notifRecurring:{en:'Recurring Transaction Alerts', ar:'تنبيهات المعاملات المتكررة', de:'Erinnerungen für wiederkehrende Transaktionen'},
  notifInvoice: {en:'Invoice Due Reminders', ar:'تذكيرات استحقاق الفواتير', de:'Erinnerungen für fällige Rechnungen'},

  planTitle:    {en:'Plan & Billing', ar:'الخطة والفوترة', de:'Tarif & Abrechnung'},
  freePlanBadge:{en:'Free Plan', ar:'الخطة المجانية', de:'Kostenloser Tarif'},
  upgradePro:   {en:'Upgrade to Pro', ar:'الترقية إلى برو', de:'Auf Pro upgraden'},
  comingSoon:   {en:'Coming soon', ar:'قريباً', de:'Demnächst verfügbar'},

  aboutTitle:   {en:'About & Legal', ar:'حول وقانوني', de:'Über & Rechtliches'},
  feedback:     {en:'Send Feedback', ar:'إرسال ملاحظات', de:'Feedback senden'},
  impressum:    {en:'Impressum', ar:'بيانات الناشر', de:'Impressum'},
  contact:      {en:'Contact', ar:'تواصل معنا', de:'Kontakt'},
  terms:        {en:'Terms of Use', ar:'شروط الاستخدام', de:'Nutzungsbedingungen'},
  privacy:      {en:'Privacy Policy', ar:'سياسة الخصوصية', de:'Datenschutzrichtlinie'},

  logoutBtn:    {en:'Log out', ar:'تسجيل الخروج', de:'Abmelden'},
  demoBtn:      {en:'Open demo account', ar:'فتح حساب الديمو', de:'Demo-Konto öffnen'},
  sampleLoad:   {en:'Load sample invoices', ar:'تحميل فواتير تجريبية', de:'Beispiel-Rechnungen laden'},
  sampleRemove: {en:'Remove sample invoices', ar:'حذف الفواتير التجريبية', de:'Beispiel-Rechnungen entfernen'},
  sampleAsk:    {en:'Add sample transport invoices (PDF) for the last 3 months to this account? You can remove them again.', ar:'إضافة فواتير نقل تجريبية (PDF) لآخر 3 شهور لهذا الحساب؟ تقدر تحذفها بعدين.', de:'Beispiel-Rechnungen (PDF) der letzten 3 Monate zu diesem Konto hinzufügen? Sie können sie wieder entfernen.'},
  sampleRmAsk:  {en:'Remove all sample invoices? Your own entries stay.', ar:'حذف كل الفواتير التجريبية؟ بياناتك الخاصة هتفضل.', de:'Alle Beispiel-Rechnungen entfernen? Ihre eigenen Einträge bleiben.'},
  accTitle: {en:'Tax advisor package', ar:'حزمة المحاسب الضريبي', de:'Steuerberater-Paket'},
  accSub: {en:'PDF with all invoices (income and expenses) + Excel with the figures, for the chosen period.', ar:'PDF بكل الفواتير (دخل ومصروفات) + Excel بالأرقام للفترة المختارة.', de:'PDF mit allen Belegen (Einnahmen und Ausgaben) + Excel mit den Zahlen für den gewählten Zeitraum.'},
  accFrom: {en:'From', ar:'من', de:'Von'},
  accTo: {en:'To', ar:'إلى', de:'Bis'},
  accPMonth: {en:'This month', ar:'الشهر ده', de:'Dieser Monat'},
  accPQuarter: {en:'This quarter', ar:'الربع ده', de:'Dieses Quartal'},
  accPYear: {en:'This year', ar:'السنة دي', de:'Dieses Jahr'},
  accPdf: {en:'PDF with invoices', ar:'PDF بالفواتير', de:'PDF mit Belegen'},
  accXlsx: {en:'Excel (figures)', ar:'Excel (الأرقام)', de:'Excel (Zahlen)'},
  accCsv: {en:'CSV for import', ar:'CSV للاستيراد', de:'CSV für Import'},
  accBusy: {en:'Preparing…', ar:'جاري التجهيز…', de:'Wird erstellt…'},
  accDone: {en:'Done — file downloaded.', ar:'تم — الملف اتنزّل.', de:'Fertig — Datei heruntergeladen.'},
  accNone: {en:'No entries in this period.', ar:'مفيش بنود في الفترة دي.', de:'Keine Buchungen in diesem Zeitraum.'},
   shTitle: {en:'Release to your tax advisor', ar:'إتاحة للمحاسب الضريبي', de:'Für Steuerberater freigeben'},
  shSub: {en:"The selected period appears in your advisor's portal (read-only). You can withdraw it any time.", ar:'الفترة المختارة هتظهر في بوابة المحاسب (قراءة فقط). تقدر تسحبها في أي وقت.', de:'Der gewählte Zeitraum erscheint im Portal Ihres Steuerberaters (nur lesen). Sie können ihn jederzeit zurückziehen.'},
  shNote: {en:'Note (optional)', ar:'ملاحظة (اختياري)', de:'Nachricht (optional)'},
  shDocs: {en:'Invoices and figures', ar:'الفواتير والأرقام', de:'Belege und Zahlen'},
  shEmp: {en:'Employees: hours and leave', ar:'الموظفين: الساعات والإجازات', de:'Mitarbeiter: Stunden und Urlaub'},
  shGov: {en:'Government entities', ar:'الجهات الحكومية', de:'Behörden'},
  shSend: {en:'Release', ar:'إتاحة', de:'Freigeben'},
  shSent: {en:"Released — it now appears in your advisor's portal.", ar:'اتاحت — ظهرت في بوابة المحاسب.', de:'Freigegeben — erscheint jetzt im Portal Ihres Steuerberaters.'},
  shSentHd: {en:'Released packages', ar:'الباكيتات المتاحة', de:'Freigegebene Pakete'},
  shRevoke: {en:'Withdraw', ar:'سحب', de:'Zurückziehen'},
  shRevoked: {en:'withdrawn', ar:'مسحوب', de:'zurückgezogen'},
  dangerTitle:  {en:'Danger Zone', ar:'منطقة الخطر', de:'Gefahrenzone'},
  deleteAccount:{en:'Delete Account', ar:'حذف الحساب', de:'Konto löschen'},
};
function stx(k) { return (SETTINGS_L[k] && SETTINGS_L[k][state.lang]) || (SETTINGS_L[k] && SETTINGS_L[k].en) || k; }

function bizTypeLabel(type) {
  var map = {general:'bizTypeGeneral', transport:'bizTypeTransport', retail:'bizTypeRetail', restaurant:'bizTypeRestaurant', construction:'bizTypeConstruction', medical:'bizTypeMedical'};
  var key = map[type] || 'bizTypeGeneral';
  return stx(key);
}

function renderSettings() {
  var updates = {
    'lbl-lang': t('language'),
    'lbl-lang-sub': t('selectLang'),
    'lbl-currency': t('currency'),
    'lbl-currency-sub': t('selectCurrency'),
    'lbl-prefs-title': stx('prefsTitle'),
    'lbl-dateformat': stx('dateFormat'),
    'lbl-dateformat-sub': stx('dateFormatSub'),
  };
  Object.entries(updates).forEach(function(entry){ var id=entry[0], val=entry[1];
    var el = document.getElementById(id);
    if(el) el.textContent = val;
  });

  // Theme toggle
  var themeTog = document.getElementById('themeToggle');
  if(themeTog) { themeTog.classList.toggle('on', state.theme==='dark'); }
  var themeIco = document.getElementById('theme-icon-wrap');
  if(themeIco) themeIco.innerHTML = svgIcon(state.theme==='dark' ? 'sun' : 'moon', 18);
  var lblTheme = document.getElementById('lbl-theme');
  if(lblTheme) lblTheme.textContent = state.theme==='dark' ? t('lightMode') : t('darkMode');
  var lblThemeSub = document.getElementById('lbl-theme-sub');
  if(lblThemeSub) lblThemeSub.textContent = t('switchTheme');

  var dfSel = document.getElementById('dateFormatSelect');
  if(dfSel) dfSel.value = state.dateFormat || 'YYYY-MM-DD';

  updateBusinessNameDisplay();
  updatePrivacyTexts();
  renderAccountSection();
  renderBusinessInfoSection();
  renderBankAccountSection();
  renderInvoiceTemplateSection();
  renderDataManagementSection();
  renderNotificationsSection();
  renderPlanSection();
  renderAboutSection();
  renderDangerSection();
}

var _profileInfoEditMode = false;
var _pendingProfileSave = null;
var _bizTypeEditMode = false;

function renderAccountSection() {
  var card = document.getElementById('settings-account-card');
  if(!card) return;
  var user = localStorage.getItem('smartac_user') || '';
  var accounts = JSON.parse(localStorage.getItem('smartac_accounts') || '{}');
  var acc = accounts[user] || {};

  var header = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">'
    + '<div style="font-weight:700;font-size:15px">' + stx('account') + '</div>'
    + (!_profileInfoEditMode ? '<button id="profileEditBtn" style="background:transparent;border:none;color:var(--primary);font-size:13px;font-weight:600;cursor:pointer">' + svgIcon('pencil', 14) + ' ' + stx('editBtn') + '</button>' : '')
    + '</div>';
  var usernameDisplayRow = bizDisplayRow(stx('profileUsername'), user);
  var profileHtml;
  if(!_profileInfoEditMode) {
    profileHtml = bizDisplayRow(stx('profileFullName'), acc.fullname)
      + usernameDisplayRow
      + bizDisplayRow(stx('profileEmail'), acc.email)
      + bizDisplayRow(stx('profilePhone'), acc.phone)
      + bizDisplayRow(stx('profileCountry'), acc.country);
  } else {
    profileHtml = bizField('profileFullNameInput', stx('profileFullName'), acc.fullname)
      + usernameDisplayRow
      + '<div style="font-size:11px;color:var(--text3);margin:-6px 0 10px">' + stx('profileUsernameNote') + '</div>'
      + bizField('profileEmailInput', stx('profileEmail'), acc.email)
      + bizField('profilePhoneInput', stx('profilePhone'), acc.phone)
      + bizField('profileCountryInput', stx('profileCountry'), acc.country)
      + _bizEditSaveCancelRow('profileSaveBtn', 'profileCancelBtn');
  }
  var bizTypeOptions = ['general','transport','retail','restaurant','construction','medical'];
  var bizTypeRow;
  if(!_bizTypeEditMode) {
    bizTypeRow = '<div style="margin-bottom:10px">'
      + '<div style="font-size:12px;color:var(--text3);margin-bottom:4px;display:flex;align-items:center;justify-content:space-between">'
      + '<span>' + stx('bizTypeLbl') + '</span>'
      + '<button id="bizTypeChangeBtn" style="background:transparent;border:none;color:var(--primary);font-size:12px;font-weight:600;cursor:pointer;padding:0">' + stx('editBtn') + '</button>'
      + '</div>'
      + '<div style="font-size:14px;font-weight:700;color:var(--text)">' + escHtml(bizTypeLabel(state.businessType)) + '</div>'
      + '</div>';
  } else {
    bizTypeRow = '<div style="margin-bottom:10px">'
      + '<div style="font-size:12px;color:var(--text3);margin-bottom:6px">' + stx('bizTypeLbl') + '</div>'
      + '<select id="bizTypeSelect" style="width:100%;padding:11px 12px;border-radius:10px;border:1.5px solid var(--border);background:var(--bg);color:var(--text);font-size:14px;box-sizing:border-box;outline:none">'
      + bizTypeOptions.map(function(v){ return '<option value="' + v + '"' + (v===state.businessType?' selected':'') + '>' + escHtml(bizTypeLabel(v)) + '</option>'; }).join('')
      + '</select>'
      + _bizEditSaveCancelRow('bizTypeSaveBtn', 'bizTypeCancelBtn')
      + '</div>';
  }
  profileHtml = profileHtml
    + bizTypeRow
    + '<div style="font-size:11px;color:var(--text3);margin:-6px 0 10px">' + stx('bizTypeNote') + '</div>';

  var previewHtml = '<div style="display:flex;flex-direction:column;align-items:center;gap:8px">'
    + '<img id="settingsLogoPreview" src="' + (state.businessLogo || '') + '" style="width:64px;height:64px;object-fit:cover;border-radius:12px;border:2px solid var(--border);display:' + (state.businessLogo ? 'block' : 'none') + '">'
    + '<div id="settingsLogoPlaceholder" style="width:64px;height:64px;border:2px dashed var(--border);border-radius:12px;align-items:center;justify-content:center;flex-direction:column;cursor:pointer;color:var(--text3);margin:0 auto;display:' + (state.businessLogo ? 'none' : 'flex') + '">'
    + svgIcon('building', 20)
    + '</div>'
    + '<button id="removeLogoBtn" style="background:none;border:none;color:#ef4444;font-size:12px;font-weight:600;cursor:pointer;display:' + (state.businessLogo ? 'inline-block' : 'none') + '">' + stx('removeLogo') + '</button>'
    + '</div>';

  card.innerHTML = header
    + profileHtml
    + '<div style="margin:16px 0 14px;padding-top:14px;border-top:1px solid var(--border)">'
    + '<div style="font-size:12px;color:var(--text3);margin-bottom:6px">' + stx('bizNameLbl') + '</div>'
    + '<input type="text" id="bizNameInput" value="' + escHtml(state.businessName||'') + '" style="width:100%;padding:11px 12px;border-radius:10px;border:1.5px solid var(--border);background:var(--bg);color:var(--text);font-size:14px;box-sizing:border-box;outline:none">'
    + '</div>'
    + '<div style="display:flex;align-items:center;gap:14px;margin-bottom:14px">'
    + previewHtml
    + '<div style="flex:1">'
    + '<button id="logoChooseBtn" style="padding:8px 14px;border-radius:10px;border:1.5px solid var(--border);background:var(--bg);color:var(--text);font-size:12px;font-weight:600;cursor:pointer">' + (state.businessLogo ? stx('uploadLogo') : stx('chooseFile')) + '</button>'
    + '<div style="font-size:10px;color:var(--text3);margin-top:6px">' + stx('logoHelper') + '</div>'
    + '<input type="file" accept="image/*" id="logoFileInput" style="display:none">'
    + '</div>'
    + '</div>'
    + '<button id="changePwBtn" style="width:100%;padding:12px;border-radius:12px;border:1.5px solid var(--border);background:var(--bg);color:var(--text);font-size:14px;font-weight:600;cursor:pointer;margin-bottom:10px">' + svgIcon('lock', 15) + ' ' + stx('changePw') + '</button>'
    + '<div style="font-size:12px;color:var(--text3)">' + stx('hello') + '<strong>' + escHtml(user) + '</strong></div>';

  var editBtn = document.getElementById('profileEditBtn');
  if(editBtn) editBtn.onclick = function(){ _profileInfoEditMode = true; renderAccountSection(); };
  if(_profileInfoEditMode) {
    var profileSaveBtn = document.getElementById('profileSaveBtn');
    if(profileSaveBtn) profileSaveBtn.onclick = function() {
      _pendingProfileSave = {
        fullname: (document.getElementById('profileFullNameInput')||{}).value || '',
        email: (document.getElementById('profileEmailInput')||{}).value || '',
        phone: (document.getElementById('profilePhoneInput')||{}).value || '',
        country: (document.getElementById('profileCountryInput')||{}).value || ''
      };
      openVerifyPassword(applyPendingProfileSave);
    };
    var profileCancelBtn = document.getElementById('profileCancelBtn');
    if(profileCancelBtn) profileCancelBtn.onclick = function(){ _profileInfoEditMode = false; renderAccountSection(); };
  }

  var bizTypeChangeBtn = document.getElementById('bizTypeChangeBtn');
  if(bizTypeChangeBtn) bizTypeChangeBtn.onclick = function(){ _bizTypeEditMode = true; renderAccountSection(); };
  if(_bizTypeEditMode) {
    var bizTypeSaveBtn = document.getElementById('bizTypeSaveBtn');
    if(bizTypeSaveBtn) bizTypeSaveBtn.onclick = async function(){
      var newType = (document.getElementById('bizTypeSelect')||{}).value;
      if(!newType || newType === state.businessType) { _bizTypeEditMode = false; renderAccountSection(); return; }
      var bizTypeTitle = {en:'Change Business Type', ar:'تغيير نوع النشاط', de:'Unternehmensart ändern'};
      if(!(await confirmAsync(bizTypeTitle[state.lang]||bizTypeTitle.en, stx('bizTypeChangeConfirm')))) return;
      state.businessType = newType;
      save();
      updateFleetNavVisibility();
      _bizTypeEditMode = false;
      renderAccountSection();
    };
    var bizTypeCancelBtn = document.getElementById('bizTypeCancelBtn');
    if(bizTypeCancelBtn) bizTypeCancelBtn.onclick = function(){ _bizTypeEditMode = false; renderAccountSection(); };
  }

  var nameInput = document.getElementById('bizNameInput');
  if(nameInput) { nameInput.onblur = function(){ saveBusinessName(this.value); }; nameInput.onchange = function(){ saveBusinessName(this.value); }; }
  var fileInput = document.getElementById('logoFileInput');
  if(fileInput) fileInput.onchange = function(e) { handleLogoUpload(e.target.files[0]); };
  var chooseBtn = document.getElementById('logoChooseBtn');
  if(chooseBtn) chooseBtn.onclick = function() { fileInput.click(); };
  var uploadArea = document.getElementById('settingsLogoPlaceholder');
  if(uploadArea) uploadArea.onclick = function() { fileInput.click(); };
  var removeBtn = document.getElementById('removeLogoBtn');
  if(removeBtn) removeBtn.onclick = removeLogo;
  var changePwBtn = document.getElementById('changePwBtn');
  if(changePwBtn) changePwBtn.onclick = openChangePassword;
}

var _bizInfoEditMode = false;
var _bankInfoEditMode = false;

function bizField(id, label, val) {
  return '<div style="margin-bottom:10px">'
    + '<div style="font-size:12px;color:var(--text3);margin-bottom:6px">' + label + '</div>'
    + '<input type="text" id="' + id + '" value="' + escHtml(val||'') + '" style="width:100%;padding:11px 12px;border-radius:10px;border:1.5px solid var(--border);background:var(--bg);color:var(--text);font-size:14px;box-sizing:border-box;outline:none">'
    + '</div>';
}
function bizDisplayRow(label, val) {
  return '<div style="margin-bottom:10px">'
    + '<div style="font-size:12px;color:var(--text3);margin-bottom:4px">' + label + '</div>'
    + '<div style="font-size:14px;font-weight:700;color:' + (val ? 'var(--text)' : 'var(--text3)') + '">' + (val ? escHtml(val) : '—') + '</div>'
    + '</div>';
}
function _bizEditSaveCancelRow(saveId, cancelId) {
  return '<div style="display:flex;gap:10px;margin-top:8px">'
    + '<button id="' + saveId + '" style="flex:1;padding:11px;border-radius:10px;border:none;background:var(--green);color:#fff;font-size:14px;font-weight:600;cursor:pointer">' + stx('saveBtn') + '</button>'
    + '<button id="' + cancelId + '" style="flex:1;padding:11px;border-radius:10px;border:1.5px solid var(--border);background:transparent;color:var(--text2);font-size:14px;font-weight:600;cursor:pointer">' + stx('cancelBtn') + '</button>'
    + '</div>';
}

function renderBusinessInfoSection() {
  var card = document.getElementById('settings-business-card');
  if(!card) return;
  var header = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">'
    + '<div style="font-weight:700;font-size:15px">' + stx('bizInfo') + '</div>'
    + (!_bizInfoEditMode ? '<button id="bizEditBtn" style="background:transparent;border:none;color:var(--primary);font-size:13px;font-weight:600;cursor:pointer">' + svgIcon('pencil', 14) + ' ' + stx('editBtn') + '</button>' : '')
    + '</div>';

  if(!_bizInfoEditMode) {
    card.innerHTML = header
      + bizDisplayRow(stx('bizAddress'), state.businessAddress)
      + bizDisplayRow(stx('bizTaxId'), state.businessTaxId)
      + bizDisplayRow(stx('bizPhone'), state.businessPhone)
      + bizDisplayRow(stx('bizEmail'), state.businessEmail)
      + '<div style="font-size:11px;color:var(--text3);margin-top:4px">' + stx('bizInfoNote') + '</div>';
    var editBtn = document.getElementById('bizEditBtn');
    if(editBtn) editBtn.onclick = function(){ _bizInfoEditMode = true; renderBusinessInfoSection(); };
  } else {
    card.innerHTML = header
      + bizField('bizAddressInput', stx('bizAddress'), state.businessAddress)
      + bizField('bizTaxIdInput', stx('bizTaxId'), state.businessTaxId)
      + bizField('bizPhoneInput', stx('bizPhone'), state.businessPhone)
      + bizField('bizEmailInput', stx('bizEmail'), state.businessEmail)
      + _bizEditSaveCancelRow('bizSaveBtn', 'bizCancelBtn');
    var saveBtn = document.getElementById('bizSaveBtn');
    if(saveBtn) saveBtn.onclick = function() {
      state.businessAddress = (document.getElementById('bizAddressInput')||{}).value || '';
      state.businessTaxId = (document.getElementById('bizTaxIdInput')||{}).value || '';
      state.businessPhone = (document.getElementById('bizPhoneInput')||{}).value || '';
      state.businessEmail = (document.getElementById('bizEmailInput')||{}).value || '';
      save();
      _bizInfoEditMode = false;
      renderBusinessInfoSection();
    };
    var cancelBtn = document.getElementById('bizCancelBtn');
    if(cancelBtn) cancelBtn.onclick = function(){ _bizInfoEditMode = false; renderBusinessInfoSection(); };
  }
}

function applyPendingProfileSave() {
  if(!_pendingProfileSave) return;
  var user = localStorage.getItem('smartac_user') || '';
  var accounts = JSON.parse(localStorage.getItem('smartac_accounts') || '{}');
  if(accounts[user]) {
    accounts[user].fullname = _pendingProfileSave.fullname;
    accounts[user].email = _pendingProfileSave.email;
    accounts[user].phone = _pendingProfileSave.phone;
    accounts[user].country = _pendingProfileSave.country;
    localStorage.setItem('smartac_accounts', JSON.stringify(accounts));
  }
  _pendingProfileSave = null;
  _profileInfoEditMode = false;
  renderAccountSection();
}

function renderBankAccountSection() {
  var card = document.getElementById('settings-bank-card');
  if(!card) return;
  var header = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">'
    + '<div style="font-weight:700;font-size:15px">' + stx('bankSectionTitle') + '</div>'
    + (!_bankInfoEditMode ? '<button id="bankEditBtn" style="background:transparent;border:none;color:var(--primary);font-size:13px;font-weight:600;cursor:pointer">' + svgIcon('pencil', 14) + ' ' + stx('editBtn') + '</button>' : '')
    + '</div>';

  if(!_bankInfoEditMode) {
    card.innerHTML = header
      + bizDisplayRow(stx('bankName'), state.bankName)
      + bizDisplayRow(stx('bankIban'), state.bankIban)
      + bizDisplayRow(stx('bankBic'), state.bankBic)
      + bizDisplayRow(stx('bankHolder'), state.bankAccountHolder);
    var editBtn = document.getElementById('bankEditBtn');
    if(editBtn) editBtn.onclick = function(){ _bankInfoEditMode = true; renderBankAccountSection(); };
  } else {
    card.innerHTML = header
      + bizField('bankNameInput', stx('bankName'), state.bankName)
      + bizField('bankIbanInput', stx('bankIban'), state.bankIban)
      + bizField('bankBicInput', stx('bankBic'), state.bankBic)
      + bizField('bankHolderInput', stx('bankHolder'), state.bankAccountHolder)
      + _bizEditSaveCancelRow('bankSaveBtn', 'bankCancelBtn');
    var bSaveBtn = document.getElementById('bankSaveBtn');
    if(bSaveBtn) bSaveBtn.onclick = function() {
      state.bankName = (document.getElementById('bankNameInput')||{}).value || '';
      state.bankIban = (document.getElementById('bankIbanInput')||{}).value || '';
      state.bankBic = (document.getElementById('bankBicInput')||{}).value || '';
      state.bankAccountHolder = (document.getElementById('bankHolderInput')||{}).value || '';
      save();
      _bankInfoEditMode = false;
      renderBankAccountSection();
    };
    var bCancelBtn = document.getElementById('bankCancelBtn');
    if(bCancelBtn) bCancelBtn.onclick = function(){ _bankInfoEditMode = false; renderBankAccountSection(); };
  }
}

function invoiceTplMockup(kind) {
  if(kind === 'modern') {
    return '<div style="width:100%;height:110px;border-radius:8px;overflow:hidden;border:1px solid var(--border);background:#fff">'
      + '<div style="height:26px;background:#0061a4;display:flex;align-items:center;padding:0 8px;gap:5px">'
      + '<div style="width:14px;height:14px;border-radius:4px;background:#fff"></div>'
      + '<div style="flex:1;height:5px;background:rgba(255,255,255,0.6);border-radius:2px;margin-top:1px"></div>'
      + '</div>'
      + '<div style="padding:8px">'
      + '<div style="width:60%;height:4px;background:#cbd5e1;border-radius:2px;margin-bottom:10px"></div>'
      + '<div style="display:flex;justify-content:space-between;padding:3px 0;border-bottom:1px solid #f1f5f9"><div style="width:40%;height:3px;background:#e2e8f0;border-radius:2px"></div><div style="width:15%;height:3px;background:#e2e8f0;border-radius:2px"></div></div>'
      + '<div style="display:flex;justify-content:space-between;padding:3px 0;border-bottom:1px solid #f1f5f9"><div style="width:35%;height:3px;background:#e2e8f0;border-radius:2px"></div><div style="width:15%;height:3px;background:#e2e8f0;border-radius:2px"></div></div>'
      + '<div style="display:flex;justify-content:flex-end;margin-top:8px">'
      + '<div style="width:45%;height:14px;background:#e3f2fd;border-radius:6px"></div>'
      + '</div>'
      + '</div>'
      + '</div>';
  }
  return '<div style="width:100%;height:110px;border-radius:8px;overflow:hidden;border:1px solid var(--border);background:#fff;padding:8px;box-sizing:border-box">'
    + '<div style="height:3px;background:#006e1c;margin:-8px -8px 8px"></div>'
    + '<div style="display:flex;align-items:center;gap:5px;margin-bottom:10px">'
    + '<div style="width:14px;height:14px;border-radius:3px;background:#cbd5e1"></div>'
    + '<div style="width:45%;height:4px;background:#94a3b8;border-radius:2px"></div>'
    + '</div>'
    + '<div style="display:flex;justify-content:space-between;padding:2px 0;border:1px solid #e2e8f0"><div style="width:40%;height:3px;background:#e2e8f0;border-radius:2px;margin:2px"></div><div style="width:15%;height:3px;background:#e2e8f0;border-radius:2px;margin:2px"></div></div>'
    + '<div style="display:flex;justify-content:space-between;padding:2px 0;border:1px solid #e2e8f0;border-top:none"><div style="width:35%;height:3px;background:#e2e8f0;border-radius:2px;margin:2px"></div><div style="width:15%;height:3px;background:#e2e8f0;border-radius:2px;margin:2px"></div></div>'
    + '<div style="display:flex;justify-content:flex-end;margin-top:8px">'
    + '<div style="width:45%;height:14px;border:1.5px solid #006e1c;border-radius:5px"></div>'
    + '</div>'
    + '</div>';
}

function renderInvoiceTemplateSection() {
  var card = document.getElementById('settings-invoice-template-card');
  if(!card) return;
  var current = state.invoiceTemplate || 'classic';

  function tplCard(id, kind, label) {
    var selected = current === kind;
    return '<div id="' + id + '" data-tpl="' + kind + '" style="cursor:pointer;border-radius:12px;padding:8px;border:2px solid ' + (selected ? 'var(--primary)' : 'var(--border)') + ';background:' + (selected ? 'var(--primary-light)' : 'transparent') + '">'
      + invoiceTplMockup(kind)
      + '<div style="display:flex;align-items:center;justify-content:center;gap:6px;margin-top:8px;font-size:13px;font-weight:700;color:' + (selected ? 'var(--primary)' : 'var(--text)') + '">'
      + (selected ? svgIcon('checkCircle', 15) : '')
      + '<span>' + label + '</span>'
      + '</div>'
      + '</div>';
  }

  card.innerHTML = '<div style="font-weight:700;font-size:15px;margin-bottom:4px">' + stx('invoiceTplTitle') + '</div>'
    + '<div style="font-size:12px;color:var(--text3);margin-bottom:12px">' + stx('invoiceTplNote') + '</div>'
    + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">'
    + tplCard('tplCardClassic', 'classic', stx('tplClassic'))
    + tplCard('tplCardModern', 'modern', stx('tplModern'))
    + '</div>'
    + '<div id="invDesignBox"></div>';

  function selectTemplate(kind) {
    if(state.invoiceTemplate === kind) return;
    state.invoiceTemplate = kind;
    save();
    renderInvoiceTemplateSection();
  }
  var classicEl = document.getElementById('tplCardClassic');
  if(classicEl) classicEl.onclick = function(){ selectTemplate('classic'); };
  var modernEl = document.getElementById('tplCardModern');
  if(modernEl) modernEl.onclick = function(){ selectTemplate('modern'); };
  if(typeof renderInvoiceDesign === 'function') renderInvoiceDesign();
}

function renderDataManagementSection() {
  var card = document.getElementById('settings-data-card');
  if(!card) return;
  var sizeKb = Math.round((JSON.stringify(state).length / 1024) * 10) / 10;
  card.innerHTML = '<div style="font-weight:700;font-size:15px;margin-bottom:12px">' + stx('dataMgmt') + '</div>'
    + '<button id="exportBackupBtn" style="width:100%;padding:12px;border-radius:12px;border:1.5px solid var(--border);background:var(--bg);color:var(--text);font-size:14px;font-weight:600;cursor:pointer;margin-bottom:10px">' + svgIcon('download', 15) + ' ' + stx('exportBackup') + '</button>'
    + '<button id="importBackupBtn" style="width:100%;padding:12px;border-radius:12px;border:1.5px solid var(--border);background:var(--bg);color:var(--text);font-size:14px;font-weight:600;cursor:pointer;margin-bottom:10px">' + svgIcon('upload', 15) + ' ' + stx('importBackup') + '</button>'
    + '<button id="clearAllDataBtn" style="width:100%;padding:12px;border-radius:12px;border:1.5px solid #ef4444;background:rgba(239,68,68,0.06);color:#ef4444;font-size:14px;font-weight:600;cursor:pointer;margin-bottom:10px">' + svgIcon('trash', 15) + ' ' + stx('clearAllData') + '</button>'
    + '<div style="font-size:11px;color:var(--text3);text-align:center">' + stx('dataSize') + sizeKb + stx('dataSizeUsed') + '</div>';

  var expBtn = document.getElementById('exportBackupBtn');
  if(expBtn) expBtn.onclick = exportBackup;
  var impBtn = document.getElementById('importBackupBtn');
  if(impBtn) impBtn.onclick = function(){ document.getElementById('importBackupInput').click(); };
  var clearBtn = document.getElementById('clearAllDataBtn');
  if(clearBtn) clearBtn.onclick = clearData;
}

function renderNotificationsSection() {
  var card = document.getElementById('settings-notif-card');
  if(!card) return;
  card.innerHTML = '<div style="font-weight:700;font-size:15px;margin-bottom:12px">' + stx('notifTitle') + '</div>'
    + notifToggleRow('notifRecurringToggle', stx('notifRecurring'), state.notifyRecurring)
    + notifToggleRow('notifInvoiceToggle', stx('notifInvoice'), state.notifyInvoiceDue);

  var t1 = document.getElementById('notifRecurringToggle');
  if(t1) t1.onclick = function(){ state.notifyRecurring = !state.notifyRecurring; save(); renderNotificationsSection(); };
  var t2 = document.getElementById('notifInvoiceToggle');
  if(t2) t2.onclick = function(){ state.notifyInvoiceDue = !state.notifyInvoiceDue; save(); renderNotificationsSection(); };
}
function notifToggleRow(id, label, on) {
  return '<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0">'
    + '<div style="font-size:14px;color:var(--text)">' + label + '</div>'
    + '<div class="toggle' + (on ? ' on' : '') + '" id="' + id + '" style="cursor:pointer"><div class="toggle-dot"></div></div>'
    + '</div>';
}

function renderPlanSection() {
  var card = document.getElementById('settings-plan-card');
  if(!card) return;
  card.innerHTML = '<div style="font-weight:700;font-size:15px;margin-bottom:12px">' + stx('planTitle') + '</div>'
    + '<span style="background:var(--primary-light);color:var(--primary);border-radius:8px;padding:4px 10px;font-size:12px;font-weight:600;display:inline-block;margin-bottom:14px">' + stx('freePlanBadge') + '</span>'
    + '<button id="upgradeProBtn" style="width:100%;padding:12px;border-radius:12px;border:none;background:#0061a4;color:#fff;font-size:14px;font-weight:700;cursor:pointer">' + stx('upgradePro') + '</button>';
  var upBtn = document.getElementById('upgradeProBtn');
  if(upBtn) upBtn.onclick = function(){ showToast(stx('comingSoon'), 'info'); };
}

function renderAboutSection() {
  var card = document.getElementById('settings-about-card');
  if(!card) return;
  card.innerHTML = '<div style="text-align:center;color:var(--text3);font-size:12px">'
    + 'Trabis v1.5<br/><br/>'
    + '<a href="javascript:void(0)" onclick="openImpressum()" style="color:var(--text3)">' + stx('impressum') + '</a> · '
    + '<a href="javascript:void(0)" onclick="openContact()" style="color:var(--text3)">' + stx('contact') + '</a> · '
    + '<a href="javascript:void(0)" onclick="openTerms()" style="color:var(--text3)">' + stx('terms') + '</a> · '
    + '<a href="javascript:void(0)" onclick="openPrivacy()" style="color:var(--text3)">' + stx('privacy') + '</a>'
    + '<br/><br/><a href="mailto:team@smartordi.eu?subject=Trabis%20Feedback" style="color:var(--primary)">' + stx('feedback') + '</a>'
    + '</div>';
}

function renderDangerSection() {
  var lo = document.getElementById('sessLogoutBtn'), dm = document.getElementById('sessDemoBtn');
  if(lo) lo.textContent = stx('logoutBtn');
  var sb = document.getElementById('sessSampleBtn');
  if(sb) sb.textContent = stx(sampleLoaded() ? 'sampleRemove' : 'sampleLoad');
  if(dm) dm.textContent = stx('demoBtn');
  var card = document.getElementById('settings-danger-card');
  if(!card) return;
  card.innerHTML = '<div style="font-weight:700;font-size:15px;margin-bottom:12px;color:#ef4444">' + stx('dangerTitle') + '</div>'
    + '<button id="deleteAccountBtn" style="width:100%;padding:12px;border-radius:12px;border:1.5px solid #ef4444;background:none;color:#ef4444;font-size:14px;font-weight:600;cursor:pointer">' + stx('deleteAccount') + '</button>';
  var delBtn = document.getElementById('deleteAccountBtn');
  if(delBtn) delBtn.onclick = openDeleteAccount;
}

function handleLogoUpload(file) {
  if(!file) return;
  var lang = state.lang;
  if(file.type.indexOf('image/') !== 0) {
    var errType = {en:'Please select an image file',ar:'يرجى اختيار ملف صورة',de:'Bitte wählen Sie eine Bilddatei'}[lang]||'Please select an image file';
    showInAppBanner('red', svgIcon('warning', 18), {en:errType,ar:errType,de:errType}, {en:'',ar:'',de:''});
    return;
  }
  if(file.size > 2*1024*1024) {
    var errSize = {en:'Image must be under 2MB',ar:'يجب أن تكون الصورة أقل من 2 ميجابايت',de:'Bild muss unter 2 MB sein'}[lang]||'Image must be under 2MB';
    showInAppBanner('red', svgIcon('warning', 18), {en:errSize,ar:errSize,de:errSize}, {en:'',ar:'',de:''});
    return;
  }
  var reader = new FileReader();
  reader.onload = function(e) {
    state.businessLogo = e.target.result;
    save();
    var previewImg = document.getElementById('settingsLogoPreview');
    var placeholder = document.getElementById('settingsLogoPlaceholder');
    if(previewImg) { previewImg.src = state.businessLogo; previewImg.style.display = 'block'; }
    if(placeholder) { placeholder.style.display = 'none'; }
    var removeBtn = document.getElementById('removeLogoBtn');
    if(removeBtn) { removeBtn.style.display = 'inline-block'; }
    updateBusinessNameDisplay();
  };
  reader.readAsDataURL(file);
}

function removeLogo() {
  state.businessLogo = null;
  save();
  renderAccountSection();
  updateBusinessNameDisplay();
}

function saveBusinessName(val) {
  state.businessName = val;
  var user = localStorage.getItem('smartac_user') || '';
  if(user) {
    var accounts = JSON.parse(localStorage.getItem('smartac_accounts') || '{}');
    if(accounts[user]) {
      accounts[user].businessName = val;
      localStorage.setItem('smartac_accounts', JSON.stringify(accounts));
    }
  }
  updateBusinessNameDisplay();
}

function setDateFormat(val) {
  state.dateFormat = val;
  save();
  renderHome();
  if(document.getElementById('settingsPage').style.display !== 'none') renderSettings();
}

function togglePwField(btn, inputId) {
  var inp = document.getElementById(inputId);
  if(!inp) return;
  inp.type = inp.type==='password' ? 'text' : 'password';
  btn.innerHTML = svgIcon(inp.type==='password' ? 'eye' : 'eyeOff', 16);
}

function lpTogglePwText(btn, inputId) {
  var inp = document.getElementById(inputId);
  if(!inp) return;
  var l = LP_TEXT[lpLang] || LP_TEXT.en;
  inp.type = inp.type==='password' ? 'text' : 'password';
  btn.textContent = inp.type==='password' ? l.showPw : l.hidePw;
}

function openChangePassword() {
  document.getElementById('cpw-current').value = '';
  document.getElementById('cpw-new').value = '';
  document.getElementById('cpw-confirm').value = '';
  var errEl = document.getElementById('cpw-error');
  errEl.style.display = 'none';
  errEl.textContent = '';
  var lang = state.lang;
  document.getElementById('cpw-title').textContent = lang==='ar' ? 'تغيير كلمة المرور' : lang==='de' ? 'Passwort ändern' : 'Change Password';
  document.getElementById('cpw-save-btn').textContent = lang==='ar' ? 'حفظ' : lang==='de' ? 'Speichern' : 'Save';
  document.getElementById('cpw-cancel-btn').textContent = lang==='ar' ? 'إلغاء' : lang==='de' ? 'Abbrechen' : 'Cancel';
  document.getElementById('changePwOverlay').classList.add('open');
}

function submitChangePassword() {
  var lang = state.lang;
  var errEl = document.getElementById('cpw-error');
  var cur = document.getElementById('cpw-current').value;
  var nw = document.getElementById('cpw-new').value;
  var confirm2 = document.getElementById('cpw-confirm').value;
  var user = localStorage.getItem('smartac_user') || '';
  var accounts = JSON.parse(localStorage.getItem('smartac_accounts') || '{}');
  var acc = accounts[user];
  var stored = acc ? acc.password : '';
  var curHash = btoa(unescape(encodeURIComponent(cur)));
  function showErr(msg) { errEl.textContent = msg; errEl.style.display = 'block'; }
  if(stored && curHash !== stored) {
    showErr(lang==='ar' ? 'كلمة المرور الحالية غير صحيحة' : lang==='de' ? 'Aktuelles Passwort ist falsch' : 'Current password is incorrect');
    return;
  }
  if(!nw || nw.length < 4) {
    showErr(lang==='ar' ? 'كلمة المرور الجديدة قصيرة جداً' : lang==='de' ? 'Neues Passwort ist zu kurz' : 'New password is too short');
    return;
  }
  if(nw !== confirm2) {
    showErr(lang==='ar' ? 'كلمتا المرور غير متطابقتين' : lang==='de' ? 'Passwörter stimmen nicht überein' : 'Passwords do not match');
    return;
  }
  if(acc) {
    acc.password = btoa(unescape(encodeURIComponent(nw)));
    localStorage.setItem('smartac_accounts', JSON.stringify(accounts));
  }
  document.getElementById('changePwOverlay').classList.remove('open');
  showToast(lang==='ar' ? 'تم تغيير كلمة المرور بنجاح' : lang==='de' ? 'Passwort erfolgreich geändert' : 'Password changed successfully', 'success');
}

var _verifyPwCallback = null;

function openVerifyPassword(callback) {
  _verifyPwCallback = callback;
  var errEl = document.getElementById('vpw-error');
  document.getElementById('vpw-input').value = '';
  errEl.style.display = 'none';
  errEl.textContent = '';
  document.getElementById('vpw-title').textContent = stx('verifyPwTitle');
  document.getElementById('vpw-sub').textContent = stx('verifyPwSub');
  document.getElementById('vpw-save-btn').textContent = stx('verifyPwConfirmBtn');
  document.getElementById('vpw-cancel-btn').textContent = stx('cancelBtn');
  document.getElementById('verifyPwOverlay').classList.add('open');
  setTimeout(function(){ var i = document.getElementById('vpw-input'); if(i) i.focus(); }, 100);
}

function closeVerifyPassword() {
  _verifyPwCallback = null;
  document.getElementById('verifyPwOverlay').classList.remove('open');
}

function submitVerifyPassword() {
  var errEl = document.getElementById('vpw-error');
  var pw = document.getElementById('vpw-input').value;
  var user = localStorage.getItem('smartac_user') || '';
  var accounts = JSON.parse(localStorage.getItem('smartac_accounts') || '{}');
  var acc = accounts[user];
  var stored = acc ? acc.password : '';
  var hash = btoa(unescape(encodeURIComponent(pw)));
  if(!pw || !stored || hash !== stored) {
    errEl.textContent = stx('verifyPwWrong');
    errEl.style.display = 'block';
    return;
  }
  var cb = _verifyPwCallback;
  _verifyPwCallback = null;
  document.getElementById('verifyPwOverlay').classList.remove('open');
  if(cb) cb();
}

// Reads every IndexedDB attachment referenced by the given ids (deduped) via getFn,
// and returns them with their Blob swapped for a base64 dataURL so they survive JSON.stringify.
async function backupCollectAttachments(getFn, ids) {
  var uniqueIds = [];
  var seen = {};
  (ids || []).forEach(function(id) { if(id != null && !seen[id]) { seen[id] = true; uniqueIds.push(id); } });
  var out = [];
  for(var i = 0; i < uniqueIds.length; i++) {
    var rec = null;
    try { rec = await getFn(uniqueIds[i]); } catch(e) {}
    if(!rec || !rec.blob) continue;
    var dataUrl;
    try { dataUrl = await imageBlobToDataUrl(rec.blob); } catch(e) { continue; }
    var copy = {};
    for(var k in rec) { if(k !== 'blob') copy[k] = rec[k]; }
    copy.dataUrl = dataUrl;
    out.push(copy);
  }
  return out;
}

async function exportBackup() {
  var backup = {
    transactions: state.transactions, clients: state.clients, suppliers: state.suppliers,
    issuedInvoices: state.issuedInvoices, receipts: state.receipts, receivedInvoices: state.receivedInvoices,
    recurring: state.recurring, installments: state.installments, employees: state.employees, fixedIncome: state.fixedIncome, vatPayments: state.vatPayments, purchasePlans: state.purchasePlans, debts: state.debts,
    budgets: state.budgets, currency: state.currency, lang: state.lang, theme: state.theme,
    businessLogo: state.businessLogo, businessAddress: state.businessAddress, businessTaxId: state.businessTaxId,
    businessPhone: state.businessPhone, businessEmail: state.businessEmail, dateFormat: state.dateFormat,
    notifyRecurring: state.notifyRecurring, notifyInvoiceDue: state.notifyInvoiceDue,
    bankName: state.bankName, bankIban: state.bankIban, bankBic: state.bankBic, bankAccountHolder: state.bankAccountHolder,
    fleet: state.fleet, assets: state.assets, inventory: state.inventory,
    businessName: state.businessName, businessType: state.businessType, bizTaxId: state.businessTaxId,
    uvaFreigaben: state.uvaFreigaben, uvaInterval: state.uvaInterval,
    notifications: state.notifications, invoiceTemplate: state.invoiceTemplate, invoiceDesign: state.invoiceDesign,
    appointments: state.appointments, notes: state.notes,
    archiveFolders: state.archiveFolders, archiveDocs: state.archiveDocs,
    contacts: state.contacts, contactDocs: state.contactDocs,
    agenda: state.agenda, agendaDocs: state.agendaDocs,
    projects: state.projects,
  };

  var receiptIds = (state.transactions || []).filter(function(tx) { return tx && tx.receiptId; }).map(function(tx) { return tx.receiptId; });
  var empDocIds = [];
  (state.employees || []).forEach(function(e) { (e.documents || []).forEach(function(d) { if(d && d.id != null) empDocIds.push(d.id); }); });
  var fleetDocIds = [];
  (state.fleet || []).forEach(function(v) { (v.documents || []).forEach(function(d) { if(d && d.id != null) fleetDocIds.push(d.id); }); });
  var archiveIds = (state.archiveDocs || []).map(function(d) { return d.id; });
  var contactDocIds = (state.contactDocs || []).map(function(d) { return d.id; });
  var agendaDocIds = (state.agendaDocs || []).map(function(d) { return d.id; });
  var projectDocIds = [];
  (state.projects || []).forEach(function(p) { (p.files || []).forEach(function(f) { if(f && f.id != null) projectDocIds.push(f.id); }); });

  var expBtn = document.getElementById('exportBackupBtn');
  if(expBtn) expBtn.disabled = true;
  try {
    backup.attachments = {
      receipts: await backupCollectAttachments(receiptGet, receiptIds),
      empdocs: await backupCollectAttachments(empDocGet, empDocIds),
      fleetdocs: await backupCollectAttachments(fleetDocGet, fleetDocIds),
      archive: await backupCollectAttachments(archiveGet, archiveIds),
      contactdocs: await backupCollectAttachments(contactDocGet, contactDocIds),
      agendadocs: await backupCollectAttachments(agendaDocGet, agendaDocIds),
      projectdocs: await backupCollectAttachments(projectDocGet, projectDocIds),
    };
  } finally {
    if(expBtn) expBtn.disabled = false;
  }

  var blob = new Blob([JSON.stringify(backup, null, 2)], {type:'application/json'});
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'smartac_backup_' + today() + '.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Turns a dataURL back into a Blob and writes the record into IndexedDB via putFn,
// re-tagging it to the currently active device user (mirrors backupCollectAttachments).
async function backupRestoreAttachments(putFn, list) {
  if(!list || !list.length) return;
  var user = localStorage.getItem('smartac_user') || '';
  for(var i = 0; i < list.length; i++) {
    var item = list[i];
    if(!item || !item.dataUrl) continue;
    var blob;
    try { var resp = await fetch(item.dataUrl); blob = await resp.blob(); } catch(e) { continue; }
    var rec = {};
    for(var k in item) { if(k !== 'dataUrl') rec[k] = item[k]; }
    rec.blob = blob;
    rec.user = user;
    try { await putFn(rec); } catch(e) {}
  }
}

function handleImportBackup(file) {
  if(!file) return;
  var reader = new FileReader();
  reader.onload = async function(e) {
    var data;
    try { data = JSON.parse(e.target.result); } catch(err) { showToast(stx('importInvalid'), 'error'); return; }
    var expectedKeys = ['transactions','clients','suppliers'];
    var hasExpected = false;
    for(var i=0;i<expectedKeys.length;i++) { if(Object.prototype.hasOwnProperty.call(data, expectedKeys[i])) { hasExpected = true; break; } }
    if(!hasExpected) { showToast(stx('importInvalid'), 'error'); return; }
    var importTitle = {en:'Import Data', ar:'استيراد البيانات', de:'Daten importieren'};
    if(!(await confirmAsync(importTitle[state.lang]||importTitle.en, stx('importConfirm')))) return;
    state.transactions = data.transactions || [];
    state.clients = data.clients || [];
    state.suppliers = data.suppliers || [];
    state.issuedInvoices = data.issuedInvoices || [];
    state.receipts = data.receipts || [];
    state.receivedInvoices = data.receivedInvoices || [];
    state.recurring = data.recurring || [];
    state.installments = data.installments || [];
    state.employees = data.employees || [];
    state.fixedIncome = data.fixedIncome || [];
    state.vatPayments = data.vatPayments || [];
    state.purchasePlans = data.purchasePlans || [];
    state.debts = data.debts || [];
    state.budgets = data.budgets || {};
    state.currency = data.currency || state.currency;
    state.lang = data.lang || state.lang;
    state.theme = data.theme || state.theme;
    state.businessLogo = data.businessLogo || null;
    state.businessAddress = data.businessAddress || '';
    state.businessTaxId = data.businessTaxId || '';
    state.businessPhone = data.businessPhone || '';
    state.businessEmail = data.businessEmail || '';
    state.dateFormat = data.dateFormat || 'YYYY-MM-DD';
    state.notifyRecurring = data.notifyRecurring !== false;
    state.notifyInvoiceDue = data.notifyInvoiceDue !== false;
    state.bankName = data.bankName || '';
    state.bankIban = data.bankIban || '';
    state.bankBic = data.bankBic || '';
    state.bankAccountHolder = data.bankAccountHolder || '';
    state.fleet = data.fleet || [];
    state.assets = data.assets || [];
    state.inventory = data.inventory || [];
    state.businessType = data.businessType || 'general';
    state.uvaFreigaben = data.uvaFreigaben || {};
    state.uvaInterval = data.uvaInterval || 'quarter';
    state.notifications = data.notifications || [];
    state.invoiceTemplate = data.invoiceTemplate || 'classic';
    state.invoiceDesign = data.invoiceDesign || {};
    state.appointments = data.appointments || [];
    state.notes = data.notes || [];
    state.archiveFolders = data.archiveFolders || [];
    state.archiveDocs = data.archiveDocs || [];
    state.contacts = data.contacts || [];
    state.contactDocs = data.contactDocs || [];
    state.agenda = data.agenda || [];
    state.agendaDocs = data.agendaDocs || [];
    state.projects = data.projects || [];
    if(data.businessName) {
      var _impUser = localStorage.getItem('smartac_session') || '';
      if(_impUser) {
        var _impAccs = JSON.parse(localStorage.getItem('smartac_accounts') || '{}');
        if(_impAccs[_impUser]) { _impAccs[_impUser].businessName = data.businessName; localStorage.setItem('smartac_accounts', JSON.stringify(_impAccs)); }
        state.businessName = data.businessName;
      }
    }
    save();
    if(data.attachments) {
      await backupRestoreAttachments(receiptPut, data.attachments.receipts);
      await backupRestoreAttachments(empDocPut, data.attachments.empdocs);
      await backupRestoreAttachments(fleetDocPut, data.attachments.fleetdocs);
      await backupRestoreAttachments(archivePut, data.attachments.archive);
      await backupRestoreAttachments(contactDocPut, data.attachments.contactdocs);
      await backupRestoreAttachments(agendaDocPut, data.attachments.agendadocs);
      await backupRestoreAttachments(projectDocPut, data.attachments.projectdocs);
    }
    applyTheme();
    applyLang();
    updateFleetNavVisibility();
    renderHome();
    renderSettings();
    showToast(stx('importSuccess'), 'success');
  };
  reader.readAsText(file);
  document.getElementById('importBackupInput').value = '';
}

function openDeleteAccount() {
  var lang = state.lang;
  document.getElementById('da-title').textContent = stx('deleteAccount');
  document.getElementById('da-msg').textContent = lang==='ar' ? 'سيتم حذف حسابك وجميع بياناتك نهائياً. لا يمكن التراجع عن هذا الإجراء. اكتب DELETE للتأكيد.' :
    lang==='de' ? 'Ihr Konto und alle Daten werden dauerhaft gelöscht. Dies kann nicht widerrufen werden. Geben Sie DELETE ein, um zu bestätigen.' :
    'This will permanently delete your account and all data. This action CANNOT be undone. Type DELETE to confirm.';
  document.getElementById('da-confirm-input').value = '';
  var btn = document.getElementById('da-confirm-btn');
  btn.disabled = true;
  btn.style.opacity = '0.5';
  document.getElementById('deleteAccountOverlay').classList.add('open');
}

function confirmDeleteAccount() {
  // Typing DELETE only unlocks this button; require a password check
  // before the account and its data are actually removed.
  document.getElementById('deleteAccountOverlay').classList.remove('open');
  openVerifyPassword(performDeleteAccount);
}

function performDeleteAccount() {
  var user = localStorage.getItem('smartac_session') || '';
  var accounts = JSON.parse(localStorage.getItem('smartac_accounts') || '{}');
  if(user && accounts[user]) {
    delete accounts[user];
    localStorage.setItem('smartac_accounts', JSON.stringify(accounts));
  }
  if(user) {
    var keys = ['tx','debts','currency','clients','suppliers','employees','recurring','budgets','lang','tax','theme','fixed_income','issued_inv','receipts','received_inv','logo','bizAddress','bizTaxId','bizPhone','bizEmail','dateFormat','notifyRecurring','notifyInvoiceDue','bankName','bankIban','bankBic','bankHolder'];
    keys.forEach(function(k){ localStorage.removeItem(uk(k)); });
  }
  localStorage.removeItem('smartac_user');
  localStorage.removeItem('smartac_session');
  localStorage.removeItem('smartac_loggedin');
  location.reload();
}

function setCurrency(val) {
  state.currency = val;
  save();
  renderHome();
}





function scheduleNightlyNotif() {
  cancelScheduledNotif();
  var now = new Date();
  var target = new Date(now);
  target.setHours(21, 0, 0, 0);
  if(now >= target) target.setDate(target.getDate() + 1);
  var msUntil = target - now;
  var timerId = setTimeout(function() {
    fireNightlySummary();
    scheduleNightlyNotif(); // reschedule for next day
  }, msUntil);
  localStorage.setItem(uk('notif_timer_set'), Date.now().toString());
  window._trabisNotifTimer = timerId;
}

function cancelScheduledNotif() {
  if(window._trabisNotifTimer) clearTimeout(window._trabisNotifTimer);
}

function fireNightlySummary() {
  if(Notification.permission !== 'granted') return;
  var lang = state.lang;
  var todayStr = today();
  var todayTxs = state.transactions.filter(function(t){ return t.date === todayStr; });
  var income = todayTxs.filter(function(t){return t.type==='income';}).reduce(function(s,t){return s+t.amount;},0);
  var expense = todayTxs.filter(function(t){return t.type==='expense';}).reduce(function(s,t){return s+t.amount;},0);
  var net = income - expense;
  var overdueDebts = state.debts.filter(function(d){return d.status!=='paid' && daysAgo(d.date)>3;});
  var bodyLines = {
    en: 'Income: '+fmt(income)+' | Expenses: '+fmt(expense)+' | Net: '+fmt(net) + (overdueDebts.length ? ' | '+overdueDebts.length+' overdue debt(s)' : ''),
    ar: 'الدخل: '+fmt(income)+' | المصاريف: '+fmt(expense)+' | الصافي: '+fmt(net) + (overdueDebts.length ? ' | '+overdueDebts.length+' دين متأخر' : ''),
    de: 'Einnahmen: '+fmt(income)+' | Ausgaben: '+fmt(expense)+' | Netto: '+fmt(net) + (overdueDebts.length ? ' | '+overdueDebts.length+' überfällige Schulden' : ''),
  };
  var titles = {en:'Trabis Daily Summary', ar:'ملخص اليوم - Trabis', de:'Trabis Tageszusammenfassung'};
  safeNotify(titles[lang]||titles.en, bodyLines[lang]||bodyLines.en, null);
}

// clearData() moved to secure implementation above






function safeNotify(title, body, fallback) {
  try {
    if(!('Notification' in window) || Notification.permission !== 'granted') {
      if(fallback) fallback();
      return;
    }
    new Notification(title, {body: body});
  } catch(e) {
    if(fallback) fallback();
  }
}

// ── NOTIFICATION CENTER ──
var NOTIF_COLORS = {success:'#006e1c', warning:'#f97316', error:'#bb1614', info:'#3b82f6'};

function formatNotifTime(iso) {
  var d = new Date(iso);
  if(isNaN(d.getTime())) return '';
  var h = d.getHours();
  var m = d.getMinutes();
  var mm = m < 10 ? ('0' + m) : ('' + m);
  return pad2(h) + ':' + mm;
}

function addNotification(message, type, sourceId) {
  var notif = {id: Date.now(), message: message, type: type || 'info', timestamp: new Date().toISOString(), read: false, sourceId: sourceId || null};
  state.notifications.unshift(notif);
  if (state.notifications.length > 50) state.notifications = state.notifications.slice(0, 50);
  save();
  updateNotifBadge();
}





function updateNotifBadge() {
  var unread = state.notifications.filter(function(n){ return !n.read; }).length;
  var badge = document.getElementById('notif-badge');
  if (badge) { badge.textContent = unread; badge.style.display = unread > 0 ? 'flex' : 'none'; }
}





var _toastStack = [];
function showToast(message, type) {
  var borderColor = NOTIF_COLORS[type] || NOTIF_COLORS.info;
  var toast = document.createElement('div');
  toast.style.cssText = 'position:fixed;right:16px;bottom:80px;z-index:600000;background:var(--card);border-radius:14px;box-shadow:0 4px 20px rgba(0,0,0,0.15);padding:12px 16px;max-width:300px;border-left:4px solid ' + borderColor + ';transition:opacity 0.4s,transform 0.4s;opacity:1';
  var msgDiv = document.createElement('div');
  msgDiv.style.cssText = 'font-size:13px;color:var(--text);white-space:pre-wrap';
  msgDiv.textContent = message;
  var timeDiv = document.createElement('div');
  timeDiv.style.cssText = 'font-size:11px;color:var(--text3);margin-top:4px';
  timeDiv.textContent = formatNotifTime(new Date().toISOString());
  toast.appendChild(msgDiv);
  toast.appendChild(timeDiv);
  document.body.appendChild(toast);
  _toastStack.push(toast);
  _positionToasts();
  setTimeout(function(){
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(8px)';
    setTimeout(function(){
      if(toast.parentNode) toast.parentNode.removeChild(toast);
      var idx = _toastStack.indexOf(toast);
      if(idx !== -1) _toastStack.splice(idx, 1);
      _positionToasts();
    }, 400);
  }, 5000);
}

function _positionToasts() {
  var bottom = 80;
  for(var i=_toastStack.length-1; i>=0; i--) {
    var t = _toastStack[i];
    if(!t.parentNode) continue;
    t.style.bottom = bottom + 'px';
    bottom += t.offsetHeight + 10;
  }
}

// ── NO SAMPLE DATA ──

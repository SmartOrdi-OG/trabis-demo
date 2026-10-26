function pad2(n) {
  n = parseInt(n, 10);
  return (n < 10 ? '0' + n : '' + n);
}
// Polyfills for older Safari
if(!Object.entries) {
  Object.entries = function(obj) {
    var keys = Object.keys(obj);
    var result = [];
    for(var i=0; i<keys.length; i++) result.push([keys[i], obj[keys[i]]]);
    return result;
  };
}
if(!Array.prototype.find) {
  Array.prototype.find = function(fn) {
    for(var i=0;i<this.length;i++) if(fn(this[i],i,this)) return this[i];
  };
}
if(!Array.prototype.findIndex) {
  Array.prototype.findIndex = function(fn) {
    for(var i=0;i<this.length;i++) if(fn(this[i],i,this)) return i;
    return -1;
  };
}
if(!String.prototype.startsWith) {
  String.prototype.startsWith = function(s) { return this.indexOf(s)===0; };
}
if(!String.prototype.padStart) {
  String.prototype.padStart = function(n,p) {
    var s = String(this);
    while(s.length < n) s = (p||' ') + s;
    return s;
  };
}
// No version reset
var LANG = {
  en: {
    appSub: "Business Tracking System",
    home: "Home", reports: "Reports", debts: "Debts", settings: "Settings", more: "More",
    today: "Today", week: "Week", month: "Month", quarter: "Quarter", year: "Year",
    custom: "Custom", singleDay: "Single Day", dateRange: "Date Range",
    fromDate: "From", toDate: "To", apply: "Apply", cancel: "Cancel",
    fillDate: "Please select a date",
    income: "Income", expense: "Expenses", net: "Net Profit",
    noTx: "No transactions yet.\nTap + to add your first one!",
    quickAdd: "Quick Add",
    addIncome: "Add Income", addExpense: "Add Expense", addDebt: "Add Debt",
    last7: "Last 7 Days",
    dailyTitle: "Daily Summary",
    dailyEmpty: "Add your first transaction to see your daily summary here.",
    recent: "Recent Transactions", seeAll: "See all",
    searchTx: "Search transactions...",
    outstanding: "Outstanding Debts",
    description: "Description (e.g. Coffee sales)",
    personName: "Person name (for debts)",
    currency: "Currency", dailySummary: "Daily Summary",
    debtReminders: "Debt Reminders", alertAfter: "Alert after 3 days",
    downloadAll: "Download all transactions",
    clearData: "Clear All Data", cannotUndo: "Cannot be undone",
    general: "General", data: "Data",
    thisMonth: "This Month", topCategories: "Top Categories",
    totalIncome: "Total Income", totalExpenses: "Total Expenses",
    netProfit: "Net Profit", profitMargin: "Profit Margin",
    transactions: "Transactions", share: "Share",
    owesMe: "Owes Me", iOwe: "I Owe",
    markPaid: "Mark Paid", noDebts: "No debts recorded.\nTap + to add a debt.",
    overdue: "Overdue", active: "Active",
    markPaid: "Mark Paid",
    freePlan: "Free Plan", upgradeTeam: "Upgrade for team features",
    noExpenses: "No expenses yet",
    clearConfirm: "Clear all data? This cannot be undone.",
    cleared: "All data cleared.",
    reportCopied: "Report copied to clipboard!",
    noOverdue: "No overdue debts! Everything is up to date",
    days: "days", daysAgoStr: "days ago", todayStr: "Today",
    pending: "pending debt", pendingPlural: "pending debts",
    selectCurrency: "Select your currency",
    addTx: 'Add Transaction',
    setupTitle: 'Setup Your Business', setupSub: 'Add your fixed costs (you can skip)',
    empLbl: 'EMPLOYEES', recLbl: 'RECURRING EXPENSES', curLbl: 'CURRENCY',
    invoices: 'Invoices',
    attachInvoice: 'Attach Invoice (Image or PDF)',
    language: 'Language',
    selectLang: 'Select language',
    notifOn: "9 PM notification",
    amount: "Amount",
    bizName: "Business Name", bizNamePh: "Business / Shop / Company name",
    exportReport: "Export Report", exportPeriod: "Period", exportContent: "Content",
    exportPrint: "Print", exportEmail: "Email", exportWhatsApp: "WhatsApp",
    exportSummary: "Summary", exportTx: "Transactions", exportDebts: "Debts",
    exportTax: "Tax", exportCancel: "Cancel",
    darkMode: "Dark Mode", lightMode: "Light Mode", switchTheme: "Switch theme",
    privacyAgree: "I agree to the", privacyPolicy: "Privacy Policy", termsOfUse: "Terms of Use",
    ppTitle: "Privacy Policy", tmTitle: "Terms of Use",
    ppContent: "<li>All data is stored locally on your device only.</li><li>No data is sent to any server.</li><li>You are responsible for your own data backup.</li><li>The app does not collect personal information externally.</li>",
    clientSince: "Client since", clientCompany: "Company", clientAddress: "Address", clientNotes: "Notes",
    clientCountry: "Country", clientStats: "Statistics", clientTxHistory: "Transaction History",
    clientDebtHistory: "Debt History", clientTotalTx: "Total Transactions", clientTotalPaid: "Total Paid",
    clientOutstanding: "Outstanding", clientLastTx: "Last Transaction", clientProfile: "Client Profile",
    clientBack: "Back", clientCall: "Call", clientEmailBtn: "Email", clientWhatsApp: "WhatsApp",
    cats: {
      Sales:"Sales", Service:"Service", Rent:"Rent", Investment:"Investment", Other:"Other",
      Fuel:"Fuel", Vehicle:"Vehicle", Government:"Government", Supplies:"Supplies", Salary:"Salary", Utilities:"Utilities", Marketing:"Marketing",
      Customer:"Customer", Supplier:"Supplier",
    }
  },
  ar: {
    appSub: "نظام تتبع الأعمال",
    home: "الرئيسية", reports: "التقارير", debts: "الديون", settings: "الإعدادات", more: "المزيد",
    today: "اليوم", week: "الأسبوع", month: "الشهر", quarter: "الربع", year: "السنة",
    custom: "تاريخ مخصص", singleDay: "يوم واحد", dateRange: "نطاق تاريخ",
    fromDate: "من", toDate: "إلى", apply: "تطبيق", cancel: "إلغاء",
    fillDate: "يرجى تحديد التاريخ",
    income: "الدخل", expense: "المصاريف", net: "صافي الربح",
    noTx: "لا توجد معاملات بعد.\nاضغط + لإضافة أول معاملة!",
    quickAdd: "إضافة سريعة",
    addIncome: "إضافة دخل", addExpense: "إضافة مصروف", addDebt: "إضافة دين",
    last7: "آخر 7 أيام",
    dailyTitle: "ملخص اليوم",
    dailyEmpty: "أضف أول معاملة لترى ملخص يومك هنا.",
    recent: "آخر المعاملات", seeAll: "عرض الكل",
    searchTx: "بحث في المعاملات...",
    outstanding: "الديون المعلقة",
    description: "الوصف (مثال: مبيعات قهوة)",
    personName: "اسم الشخص (للديون)",
    currency: "العملة", dailySummary: "ملخص يومي",
    debtReminders: "تذكير الديون", alertAfter: "تنبيه بعد 3 أيام",
    downloadAll: "تحميل كل المعاملات",
    clearData: "مسح كل البيانات", cannotUndo: "لا يمكن التراجع",
    general: "عام", data: "البيانات",
    thisMonth: "هذا الشهر", topCategories: "أعلى الفئات",
    totalIncome: "إجمالي الدخل", totalExpenses: "إجمالي المصاريف",
    netProfit: "صافي الربح", profitMargin: "هامش الربح",
    transactions: "معاملات", share: "مشاركة",
    owesMe: "مدين لي", iOwe: "أنا مدين",
    markPaid: "تم السداد", noDebts: "لا ديون مسجلة.\nاضغط + لإضافة دين.",
    overdue: "متأخر", active: "نشط",
    freePlan: "الخطة المجانية", upgradeTeam: "ترقية للفريق",
    noExpenses: "لا مصاريف بعد",
    clearConfirm: "مسح كل البيانات؟ لا يمكن التراجع.",
    cleared: "تم مسح كل البيانات.",
    reportCopied: "تم نسخ التقرير!",
    noOverdue: "لا ديون متأخرة! كل شيء على ما يرام",
    days: "أيام", daysAgoStr: "أيام مضت", todayStr: "اليوم",
    pending: "دين معلق", pendingPlural: "ديون معلقة",
    selectCurrency: "اختر العملة",
    addTx: 'إضافة معاملة',
    setupTitle: 'إعداد عملك', setupSub: 'أضف تكاليفك الثابتة (يمكن تخطيها)',
    empLbl: 'الموظفين', recLbl: 'المصاريف المتكررة', curLbl: 'العملة',
    invoices: 'الفواتير',
    attachInvoice: 'إرفاق فاتورة (صورة أو PDF)',
    language: 'اللغة',
    selectLang: 'اختر اللغة',
    notifOn: "إشعار الساعة 9 مساءً",
    amount: "المبلغ",
    bizName: "اسم المشروع", bizNamePh: "اسم المشروع / المحل / الشركة",
    exportReport: "تصدير التقرير", exportPeriod: "الفترة", exportContent: "المحتوى",
    exportPrint: "طباعة", exportEmail: "إيميل", exportWhatsApp: "واتساب",
    exportSummary: "الملخص", exportTx: "المعاملات", exportDebts: "الديون",
    exportTax: "الضريبة", exportCancel: "إلغاء",
    darkMode: "الوضع الداكن", lightMode: "الوضع الفاتح", switchTheme: "تغيير المظهر",
    privacyAgree: "أوافق على", privacyPolicy: "سياسة الخصوصية", termsOfUse: "شروط الاستخدام",
    ppTitle: "سياسة الخصوصية", tmTitle: "شروط الاستخدام",
    ppContent: "<li>يتم تخزين جميع البيانات محلياً على جهازك فقط.</li><li>لا يتم إرسال أي بيانات إلى أي خادم.</li><li>أنت مسؤول عن نسخ بياناتك الاحتياطية.</li><li>التطبيق لا يجمع معلومات شخصية خارجياً.</li>",
    clientSince: "عميل منذ", clientCompany: "الشركة", clientAddress: "العنوان", clientNotes: "ملاحظات",
    clientCountry: "الدولة", clientStats: "إحصائيات", clientTxHistory: "تاريخ المعاملات",
    clientDebtHistory: "تاريخ الديون", clientTotalTx: "إجمالي المعاملات", clientTotalPaid: "إجمالي المدفوع",
    clientOutstanding: "المستحق", clientLastTx: "آخر معاملة", clientProfile: "ملف العميل",
    clientBack: "رجوع", clientCall: "اتصال", clientEmailBtn: "إيميل", clientWhatsApp: "واتساب",
    cats: {
      Sales:"مبيعات", Service:"خدمات", Rent:"إيجار", Investment:"استثمار", Other:"أخرى",
      Fuel:"وقود", Vehicle:"عربية", Government:"جهات حكومية", Supplies:"مستلزمات", Salary:"رواتب", Utilities:"مرافق", Marketing:"تسويق",
      Customer:"عميل", Supplier:"مورد",
    }
  },
  de: {
    appSub: "Geschäfts-Tracking-System",
    home: "Start", reports: "Berichte", debts: "Schulden", settings: "Einstellungen", more: "Mehr",
    today: "Heute", week: "Woche", month: "Monat", quarter: "Quartal", year: "Jahr",
    custom: "Benutzerdefiniert", singleDay: "Einzelner Tag", dateRange: "Datumsbereich",
    fromDate: "Von", toDate: "Bis", apply: "Anwenden", cancel: "Abbrechen",
    fillDate: "Bitte Datum auswählen",
    income: "Einnahmen", expense: "Ausgaben", net: "Nettogewinn",
    noTx: "Noch keine Transaktionen.\nTippe + um die erste hinzuzufügen!",
    quickAdd: "Schnell hinzufügen",
    addIncome: "Einnahme hinzufügen", addExpense: "Ausgabe hinzufügen", addDebt: "Schuld hinzufügen",
    last7: "Letzte 7 Tage",
    dailyTitle: "Tageszusammenfassung",
    dailyEmpty: "Füge deine erste Transaktion hinzu um die Zusammenfassung zu sehen.",
    recent: "Letzte Transaktionen", seeAll: "Alle anzeigen",
    searchTx: "Transaktionen suchen...",
    outstanding: "Offene Schulden",
    description: "Beschreibung (z.B. Kaffeeverkauf)",
    personName: "Name der Person (für Schulden)",
    currency: "Währung", dailySummary: "Tageszusammenfassung",
    debtReminders: "Schulden-Erinnerungen", alertAfter: "Alarm nach 3 Tagen",
    downloadAll: "Alle Transaktionen herunterladen",
    clearData: "Alle Daten löschen", cannotUndo: "Kann nicht rückgängig gemacht werden",
    general: "Allgemein", data: "Daten",
    thisMonth: "Diesen Monat", topCategories: "Top-Kategorien",
    totalIncome: "Gesamteinnahmen", totalExpenses: "Gesamtausgaben",
    netProfit: "Nettogewinn", profitMargin: "Gewinnmarge",
    transactions: "Transaktionen", share: "Teilen",
    owesMe: "Schuldet mir", iOwe: "Ich schulde",
    markPaid: "Als bezahlt markieren", noDebts: "Keine Schulden eingetragen.\nTippe + um eine Schuld hinzuzufügen.",
    overdue: "Überfällig", active: "Aktiv",
    freePlan: "Kostenloser Plan", upgradeTeam: "Upgrade für Team-Funktionen",
    noExpenses: "Noch keine Ausgaben",
    clearConfirm: "Alle Daten löschen? Dies kann nicht rückgängig gemacht werden.",
    cleared: "Alle Daten wurden gelöscht.",
    reportCopied: "Bericht in Zwischenablage kopiert!",
    noOverdue: "Keine überfälligen Schulden! Alles ist aktuell",
    days: "Tage", daysAgoStr: "Tage her", todayStr: "Heute",
    pending: "offene Schuld", pendingPlural: "offene Schulden",
    selectCurrency: "Währung auswählen",
    addTx: 'Transaktion hinzufügen',
    setupTitle: 'Unternehmen einrichten', setupSub: 'Fixkosten hinzufügen (optional)',
    empLbl: 'MITARBEITER', recLbl: 'WIEDERKEHRENDE AUSGABEN', curLbl: 'WÄHRUNG',
    invoices: 'Rechnungen',
    attachInvoice: 'Rechnung anhängen (Bild oder PDF)',
    language: 'Sprache',
    selectLang: 'Sprache auswählen',
    notifOn: "Benachrichtigung um 21 Uhr",
    amount: "Betrag",
    bizName: "Unternehmensname", bizNamePh: "Geschäfts- / Firmenname",
    exportReport: "Bericht exportieren", exportPeriod: "Zeitraum", exportContent: "Inhalt",
    exportPrint: "Drucken", exportEmail: "E-Mail", exportWhatsApp: "WhatsApp",
    exportSummary: "Zusammenfassung", exportTx: "Transaktionen", exportDebts: "Schulden",
    exportTax: "Steuer", exportCancel: "Abbrechen",
    darkMode: "Dunkelmodus", lightMode: "Hellmodus", switchTheme: "Design wechseln",
    privacyAgree: "Ich stimme zu", privacyPolicy: "Datenschutzrichtlinie", termsOfUse: "Nutzungsbedingungen",
    ppTitle: "Datenschutzrichtlinie", tmTitle: "Nutzungsbedingungen",
    ppContent: "<li>Alle Daten werden nur lokal auf Ihrem Gerät gespeichert.</li><li>Es werden keine Daten an Server gesendet.</li><li>Sie sind für die Sicherung Ihrer Daten verantwortlich.</li><li>Die App sammelt keine persönlichen Daten extern.</li>",
    clientSince: "Kunde seit", clientCompany: "Unternehmen", clientAddress: "Adresse", clientNotes: "Notizen",
    clientCountry: "Land", clientStats: "Statistiken", clientTxHistory: "Transaktionsverlauf",
    clientDebtHistory: "Schuldenverlauf", clientTotalTx: "Transaktionen gesamt", clientTotalPaid: "Bezahlt gesamt",
    clientOutstanding: "Ausstehend", clientLastTx: "Letzte Transaktion", clientProfile: "Kundenprofil",
    clientBack: "Zurück", clientCall: "Anrufen", clientEmailBtn: "E-Mail", clientWhatsApp: "WhatsApp",
    cats: {
      Sales:"Verkauf", Service:"Service", Rent:"Miete", Investment:"Investition", Other:"Sonstiges",
      Fuel:"Kraftstoff", Vehicle:"Fahrzeug", Government:"Behörden", Supplies:"Vorräte", Salary:"Gehalt", Utilities:"Nebenkosten", Marketing:"Marketing",
      Customer:"Kunde", Supplier:"Lieferant",
    }
  }
};

function t(key) { return (LANG[state.lang]||LANG.en)[key] || key; }
function tc(cat) { return ((LANG[state.lang]||LANG.en).cats||{})[cat] || cat; }
function daysAgoStr(days) {
  if(days===0) return t('todayStr');
  return days + ' ' + t('daysAgoStr');
}

// ── STATE ──


var state = {
  transactions: [],
  debts: [],
  currency: '€',
  lang: localStorage.getItem('smartac_lang') || 'en',
  period: 'month',          // the home filter is always a single month now
  txTab: 'expense',         // which side of the month the home list is showing
  homeView: 'picker',       // 'picker' = year/month chooser, 'month' = the month screen
  year: new Date().getFullYear(),
  month: new Date().getMonth(),
  customDateFilter: null,
  reportPeriod: 'month',
  vatBasis: 'ist',
  currentType: 'income',
  currentCat: 'Sales',
  debtTab: 'owes',
  debtDirection: 'creditor',
  pendingInvoice: null,
  pendingInvoiceName: null,
  clients: [],
  suppliers: [],
  employees: [],
  recurring: [],
  installments: [],
  budgets: {},
  theme: 'light',
  businessName: '',
  fixedIncome: [],
  purchasePlans: [], // Ratenkauf, see js/13d-purchase-plans.js
  vatPayments: [],   // MwSt paid to the Finanzamt: {id, date:'YYYY-MM-DD', period:'YYYY-MM' (month it pays for), amount}
  issuedInvoices: [],
  receipts: [],
  receivedInvoices: [],
  businessLogo: null,
  businessAddress: '',
  businessTaxId: '',
  businessPhone: '',
  businessEmail: '',
  dateFormat: 'YYYY-MM-DD',
  notifyRecurring: true,
  notifyInvoiceDue: true,
  bankName: '',
  bankIban: '',
  bankBic: '',
  bankAccountHolder: '',
  notifications: [],
  businessType: '',
  invoiceTemplate: 'classic',
  appointments: [],
  notes: [],
  fleet: [],
  assets: [],
  inventory: [],
  archiveFolders: [],
  archiveDocs: [],
  contacts: [],
  contactDocs: [],
  agenda: [],
  agendaDocs: [],
  projects: [],
};

var CURRENCIES = {
  '€':   {code:'EUR', en:'Euro €',              ar:'يورو €',             de:'Euro €'},
  '$':   {code:'USD', en:'Dollar $',            ar:'دولار $',            de:'Dollar $'},
  '£':   {code:'GBP', en:'Pound £',             ar:'جنيه إسترليني £',   de:'Pfund £'},
  'E£':  {code:'EGP', en:'Pound E£',            ar:'جنيه مصري E£',      de:'Äg. Pfund E£'},
  '﷼':   {code:'SAR', en:'Riyal ﷼',            ar:'ريال ﷼',            de:'Riyal ﷼'},
  'د.إ': {code:'AED', en:'Dirham د.إ',          ar:'درهم د.إ',          de:'Dirham د.إ'},
};
function getCurrencyLabel(sym) {
  var c = CURRENCIES[sym];
  if(!c) return sym;
  return c[state.lang] || c.en;
}



var CATS = {
  income: ['Sales','Service','Rent','Investment','Other'],
  expense: ['Fuel','Vehicle','Supplies','Rent','Salary','Government','Utilities','Marketing','Other'],
  debt: ['Customer','Supplier','Other'],
};

// ── HELPERS ──
function fmt(n) {
  var abs = Math.abs(n);
  var fixed = abs.toFixed(2);
  var parts = fixed.split('.');
  var intPart = parts[0];
  var decPart = parts[1];
  var result = '';
  var count = 0;
  for(var i = intPart.length - 1; i >= 0; i--) {
    result = intPart[i] + result;
    count++;
    if(count % 3 === 0 && i !== 0) result = '.' + result;
  }
  return state.currency + ' ' + result + ',' + decPart;
}

// Accepts both "30.5" and "30,5" (Austrian/German decimal comma), plus
// thousands-separated input like "1.234,56" or "1,234.56".
function parseAmount(str) {
  if(str == null) return NaN;
  var s = String(str).trim().replace(/[^0-9.,]/g, '');
  if(!s) return NaN;
  var lastComma = s.lastIndexOf(',');
  var lastDot = s.lastIndexOf('.');
  if(lastComma > -1 && lastDot > -1) {
    s = lastComma > lastDot ? s.replace(/\./g, '').replace(',', '.') : s.replace(/,/g, '');
  } else if(lastComma > -1) {
    var decimals = s.length - lastComma - 1;
    var onlyOneComma = s.indexOf(',') === lastComma;
    s = (onlyOneComma && decimals >= 1 && decimals <= 2) ? s.replace(',', '.') : s.replace(/,/g, '');
  }
  return parseFloat(s);
}

// Light input mask: digits only, plus at most one '.' and at most one ','
// (both may appear together, e.g. "2.200,50" — thousands dot + decimal comma)
function sanitizeAmountField(el) {
  var v = el.value;
  var cleaned = v.replace(/[^0-9.,]/g, '');
  var seenDot = false, seenComma = false, out = '';
  for(var i = 0; i < cleaned.length; i++) {
    var ch = cleaned[i];
    if(ch === '.') { if(seenDot) continue; seenDot = true; }
    else if(ch === ',') { if(seenComma) continue; seenComma = true; }
    out += ch;
  }
  if(out !== v) el.value = out;
}
function today() {
  var d = new Date();
  var month = pad2(d.getMonth()+1);
  var day = pad2(d.getDate());
  return d.getFullYear() + '-' + month + '-' + day;
}
function daysAgo(d) { return Math.floor((Date.now() - new Date(d)) / 86400000); }
function formatDateDisplay(dateStr) {
  if(!dateStr) return '';
  var s = String(dateStr).substring(0,10);
  var parts = s.split('-');
  if(parts.length !== 3) return s;
  var y = parts[0], m = parts[1], d = parts[2];
  var f = state.dateFormat || 'YYYY-MM-DD';
  if(f === 'DD/MM/YYYY') return d + '/' + m + '/' + y;
  if(f === 'MM/DD/YYYY') return m + '/' + d + '/' + y;
  return y + '-' + m + '-' + d;
}
// Per-user storage key helper
// Uses smartac_session (the currently active session) rather than
// smartac_user (a remembered-for-convenience username that logout()
// intentionally leaves behind), so a new/different user can never
// resolve to a previous user's data keys.
function uk(key) {
  var user = localStorage.getItem('smartac_session') || 'default';
  return 'smartac_u_' + user + '_' + key;
}

function escHtml(s){ return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

var SVG_ICON_PATHS = {
  landmark: '<path d="M3 22h18"/><path d="M6 18v-7"/><path d="M10 18v-7"/><path d="M14 18v-7"/><path d="M18 18v-7"/><path d="M12 2 3 7h18L12 2Z"/>',
  briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>',
  lock: '<rect x="4" y="11" width="16" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  logout: '<path d="M9 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4"/><path d="M15 17l5-5-5-5"/><path d="M20 12H9"/>',
  pencil: '<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
  download: '<path d="M12 3v12"/><path d="M7 10l5 5 5-5"/><path d="M5 21h14"/>',
  upload: '<path d="M12 3v10"/><path d="M7 8l5-5 5 5"/><path d="M5 21h14"/>',
  trash: '<path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/>',
  eye: '<path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z"/><circle cx="12" cy="12" r="3"/>',
  eyeOff: '<path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a21.86 21.86 0 0 1 5.06-6.06"/><path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 7 11 7a21.9 21.9 0 0 1-3.22 4.36"/><path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/><path d="M1 1l22 22"/>',
  warning: '<path d="M12 3 2 20h20L12 3Z"/><path d="M12 10v4"/><path d="M12 17h.01"/>',
  building: '<path d="M4 21V5a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v16"/><path d="M15 21v-9a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v9"/><path d="M9 8h.01M9 12h.01M9 16h.01M13 8h.01M13 12h.01M13 16h.01"/><path d="M4 21h16"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 4 5.7 4 9s-1.5 6.5-4 9c-2.5-2.5-4-5.7-4-9s1.5-6.5 4-9z"/>',
  exchange: '<path d="M4 7h13"/><path d="M14 3l4 4-4 4"/><path d="M20 17H7"/><path d="M10 21l-4-4 4-4"/>',
  moon: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  xCircle: '<circle cx="12" cy="12" r="9"/><path d="M15 9l-6 6M9 9l6 6"/>',
  checkCircle: '<circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.5 2.5 5-5"/>',
  x: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
  check: '<polyline points="20 6 9 17 4 12"/>',
  money: '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/>',
  scissors: '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/>',
  handshake: '<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>',
  bell: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>',
  printDownload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7 12.7 13.1a1.94 1.94 0 0 1-2.06 0L2 7"/>',
  message: '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>',
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>',
  fileText: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
  barChart: '<line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/>',
  trendingUp: '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>',
  menu: '<line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>',
  user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  refreshCw: '<polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>',
  paperclip: '<path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>',
  image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>',
  shoppingCart: '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>',
  home: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  pin: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
  droplet: '<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>',
  packageIcon: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>',
  lightbulb: '<path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/>',
  megaphone: '<path d="M3 11l18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
  users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
  checklist: '<rect x="3" y="5" width="6" height="6" rx="1"/><path d="M4.5 8l1 1 2-2"/><path d="M12 8h9"/><rect x="3" y="15" width="6" height="6" rx="1"/><path d="M4.5 18l1 1 2-2"/><path d="M12 18h9"/>',
  truck: '<path d="M10 17h4V5H2v12h3"/><path d="M14 9h4l3 3v5h-3"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>',
  note: '<rect x="4" y="4" width="16" height="16" rx="2"/><line x1="8" y1="9" x2="16" y2="9"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="12" y2="17"/>',
  folder: '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>',
  externalLink: '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>',
  helpCircle: '<circle cx="12" cy="12" r="9"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  chevronRight: '<polyline points="9 18 15 12 9 6"/>',
  chevronLeft: '<polyline points="15 18 9 12 15 6"/>',
  camera: '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>'
};
var CAT_ICON_KEYS = {
  Sales:'shoppingCart', Service:'scissors', Rent:'home', Investment:'trendingUp', Other:'pin',
  Fuel:'droplet', Vehicle:'truck', Government:'building', Supplies:'packageIcon', Salary:'user', Utilities:'lightbulb', Marketing:'megaphone',
  Customer:'user', Supplier:'building',
};
function svgIcon(name, size) {
  size = size || 16;
  var body = SVG_ICON_PATHS[name] || '';
  var classAttr = (name === 'chevronLeft' || name === 'chevronRight') ? ' class="ico-chevron"' : '';
  return '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-3px;flex-shrink:0"' + classAttr + '>' + body + '</svg>';
}
function txIconSvg(tx, size) {
  var key = CAT_ICON_KEYS[tx.category] || 'pin';
  return svgIcon(key, size || 18);
}
function save() {
  var txKey = uk('tx');
  localStorage.setItem(txKey, JSON.stringify(state.transactions));
  localStorage.setItem(uk('debts'), JSON.stringify(state.debts));
  localStorage.setItem(uk('currency'), state.currency);
  localStorage.setItem(uk('clients'), JSON.stringify(state.clients));
  localStorage.setItem(uk('suppliers'), JSON.stringify(state.suppliers));
  localStorage.setItem(uk('employees'), JSON.stringify(state.employees));
  localStorage.setItem(uk('fleet'), JSON.stringify(state.fleet));
  localStorage.setItem(uk('assets'), JSON.stringify(state.assets));
  localStorage.setItem(uk('inventory'), JSON.stringify(state.inventory));
  localStorage.setItem(uk('recurring'), JSON.stringify(state.recurring));
  localStorage.setItem(uk('installments'), JSON.stringify(state.installments || []));
  localStorage.setItem(uk('budgets'), JSON.stringify(state.budgets));
  localStorage.setItem(uk('lang'), state.lang);
  localStorage.setItem(uk('uvaInterval'), state.uvaInterval || 'quarter');
  localStorage.setItem(uk('vatBasis'), state.vatBasis || 'ist');
  localStorage.setItem(uk('uvaFreigaben'), JSON.stringify(state.uvaFreigaben || {}));
  localStorage.setItem(uk('theme'), state.theme);
  localStorage.setItem(uk('fixed_income'), JSON.stringify(state.fixedIncome||[]));
  localStorage.setItem(uk('vat_payments'), JSON.stringify(state.vatPayments||[]));
  localStorage.setItem(uk('purchase_plans'), JSON.stringify(state.purchasePlans||[]));
  localStorage.setItem(uk('issued_inv'), JSON.stringify(state.issuedInvoices||[]));
  localStorage.setItem(uk('receipts'), JSON.stringify(state.receipts||[]));
  localStorage.setItem(uk('received_inv'), JSON.stringify(state.receivedInvoices||[]));
  localStorage.setItem(uk('logo'), state.businessLogo || '');
  localStorage.setItem(uk('bizAddress'), state.businessAddress || '');
  localStorage.setItem(uk('bizTaxId'), state.businessTaxId || '');
  localStorage.setItem(uk('bizPhone'), state.businessPhone || '');
  localStorage.setItem(uk('bizEmail'), state.businessEmail || '');
  localStorage.setItem(uk('dateFormat'), state.dateFormat || 'YYYY-MM-DD');
  localStorage.setItem(uk('notifyRecurring'), state.notifyRecurring === false ? '0' : '1');
  localStorage.setItem(uk('notifyInvoiceDue'), state.notifyInvoiceDue === false ? '0' : '1');
  localStorage.setItem(uk('bankName'), state.bankName || '');
  localStorage.setItem(uk('bankIban'), state.bankIban || '');
  localStorage.setItem(uk('bankBic'), state.bankBic || '');
  localStorage.setItem(uk('bankHolder'), state.bankAccountHolder || '');
  localStorage.setItem(uk('notifs'), JSON.stringify(state.notifications));
  localStorage.setItem(uk('businessType'), state.businessType);
  localStorage.setItem(uk('invoiceTpl'), state.invoiceTemplate || 'classic');
  localStorage.setItem(uk('appointments'), JSON.stringify(state.appointments));
  localStorage.setItem(uk('notes'), JSON.stringify(state.notes));
  localStorage.setItem(uk('archiveFolders'), JSON.stringify(state.archiveFolders || []));
  localStorage.setItem(uk('archiveDocs'), JSON.stringify(state.archiveDocs || []));
  localStorage.setItem(uk('contacts'), JSON.stringify(state.contacts || []));
  localStorage.setItem(uk('contactDocs'), JSON.stringify(state.contactDocs || []));
  localStorage.setItem(uk('agenda'), JSON.stringify(state.agenda || []));
  localStorage.setItem(uk('agendaDocs'), JSON.stringify(state.agendaDocs || []));
  localStorage.setItem(uk('projects'), JSON.stringify(state.projects || []));
}

var _loadedDataUser = null;
function loadUserData() {
  // Always read the active user fresh at call time (never cache it),
  // and remember whose data this load call was for.
  _loadedDataUser = localStorage.getItem('smartac_session') || 'default';
  state.transactions = JSON.parse(localStorage.getItem(uk('tx')) || '[]');
  state.debts = JSON.parse(localStorage.getItem(uk('debts')) || '[]');
  state.currency = localStorage.getItem(uk('currency')) || '€';
  state.lang = localStorage.getItem(uk('lang')) || localStorage.getItem('smartac_lang') || 'en';
  state.clients = JSON.parse(localStorage.getItem(uk('clients')) || '[]');
  state.suppliers = JSON.parse(localStorage.getItem(uk('suppliers')) || '[]');
  state.employees = JSON.parse(localStorage.getItem(uk('employees')) || '[]');
  state.fleet = JSON.parse(localStorage.getItem(uk('fleet')) || '[]');
  state.assets = JSON.parse(localStorage.getItem(uk('assets')) || '[]');
  state.inventory = JSON.parse(localStorage.getItem(uk('inventory')) || '[]');
  state.recurring = JSON.parse(localStorage.getItem(uk('recurring')) || '[]');
  state.installments = JSON.parse(localStorage.getItem(uk('installments')) || '[]');
  state.budgets = JSON.parse(localStorage.getItem(uk('budgets')) || '{}');
  state.uvaInterval = localStorage.getItem(uk('uvaInterval')) || 'quarter';
  state.vatBasis = localStorage.getItem(uk('vatBasis')) || 'ist';
  state.uvaFreigaben = JSON.parse(localStorage.getItem(uk('uvaFreigaben')) || '{}');
  state.theme = localStorage.getItem(uk('theme')) || 'light';
  state.fixedIncome = JSON.parse(localStorage.getItem(uk('fixed_income')) || '[]');
  state.vatPayments = JSON.parse(localStorage.getItem(uk('vat_payments')) || '[]');
  state.purchasePlans = JSON.parse(localStorage.getItem(uk('purchase_plans')) || '[]');
  state.issuedInvoices = JSON.parse(localStorage.getItem(uk('issued_inv')) || '[]');
  state.receipts = JSON.parse(localStorage.getItem(uk('receipts')) || '[]');
  state.receivedInvoices = JSON.parse(localStorage.getItem(uk('received_inv')) || '[]');
  state.businessLogo = localStorage.getItem(uk('logo')) || null;
  state.businessAddress = localStorage.getItem(uk('bizAddress')) || '';
  state.businessTaxId = localStorage.getItem(uk('bizTaxId')) || '';
  state.businessPhone = localStorage.getItem(uk('bizPhone')) || '';
  state.businessEmail = localStorage.getItem(uk('bizEmail')) || '';
  state.dateFormat = localStorage.getItem(uk('dateFormat')) || 'YYYY-MM-DD';
  state.notifyRecurring = localStorage.getItem(uk('notifyRecurring')) !== '0';
  state.notifyInvoiceDue = localStorage.getItem(uk('notifyInvoiceDue')) !== '0';
  state.bankName = localStorage.getItem(uk('bankName')) || '';
  state.bankIban = localStorage.getItem(uk('bankIban')) || '';
  state.bankBic = localStorage.getItem(uk('bankBic')) || '';
  state.bankAccountHolder = localStorage.getItem(uk('bankHolder')) || '';
  state.notifications = JSON.parse(localStorage.getItem(uk('notifs')) || '[]');
  state.businessType = localStorage.getItem(uk('businessType')) || 'general';
  state.appointments = JSON.parse(localStorage.getItem(uk('appointments')) || '[]');
  state.notes = JSON.parse(localStorage.getItem(uk('notes')) || '[]');
  state.invoiceTemplate = localStorage.getItem(uk('invoiceTpl')) || 'classic';
  state.archiveFolders = JSON.parse(localStorage.getItem(uk('archiveFolders')) || '[]');
  state.archiveDocs = JSON.parse(localStorage.getItem(uk('archiveDocs')) || '[]');
  state.contacts = JSON.parse(localStorage.getItem(uk('contacts')) || '[]');
  state.contactDocs = JSON.parse(localStorage.getItem(uk('contactDocs')) || '[]');
  state.agenda = JSON.parse(localStorage.getItem(uk('agenda')) || '[]');
  state.agendaDocs = JSON.parse(localStorage.getItem(uk('agendaDocs')) || '[]');
  state.projects = JSON.parse(localStorage.getItem(uk('projects')) || '[]');
  var user2 = localStorage.getItem('smartac_session') || '';
  if(user2) {
    var accs = JSON.parse(localStorage.getItem('smartac_accounts') || '{}');
    state.businessName = (accs[user2] && accs[user2].businessName) || '';
  }
  updateFleetNavVisibility();
  applyTheme();
}

function updateFleetNavVisibility() {
  var snavFleetEl = document.getElementById('snav-fleet');
  if(snavFleetEl) snavFleetEl.style.display = state.businessType === 'transport' ? 'flex' : 'none';
  var snavInvEl = document.getElementById('snav-inventory');
  if(snavInvEl) snavInvEl.style.display = (state.businessType === 'retail' || state.businessType === 'transport') ? 'flex' : 'none';
}

// Whether a YYYY-MM-DD date string falls inside the currently active
// period/custom-date filter — shared by getFiltered() and anything that
// needs to know in advance whether a given date would actually be visible
// (e.g. deciding whether to switch the filter after adding a transaction).
function txDateMatchesFilter(txDate) {
  var now = new Date();
  var todayStr = today();
  var d = new Date(txDate + 'T12:00:00'); // noon to avoid timezone issues
  if(state.customDateFilter) {
    if(state.customDateFilter.mode === 'single') return txDate === state.customDateFilter.date;
    if(state.customDateFilter.mode === 'range') return txDate >= state.customDateFilter.from && txDate <= state.customDateFilter.to;
    return true;
  }
  if(state.period === 'today') return txDate === todayStr;
  if(state.period === 'week') { var w = new Date(now); w.setDate(w.getDate()-7); return d >= w; }
  if(state.period === 'month') return d.getMonth()===state.month && d.getFullYear()===state.year;
  if(state.period === 'quarter') return Math.floor(d.getMonth()/3)===Math.floor(now.getMonth()/3) && d.getFullYear()===now.getFullYear();
  if(state.period === 'year') return d.getFullYear()===now.getFullYear();
  return true;
}

function getFiltered() {
  return state.transactions.filter(function(tx) {
    if(!tx || !tx.date) return false;
    return txDateMatchesFilter(tx.date.substring(0,10));
  });
}

// ── NAV ──
function showNav(page) {
  window._artPage = page;
  setTimeout(artSyncTopbar, 0);
  if(page === 'fleet' && state.businessType !== 'transport') { showNav('home'); return; }
  var pages = {home:'mainPage',settings:'settingsPage',employees:'employeesPage',help:'helpPage',fleet:'fleetPage',contacts:'contactsPage',agenda:'agendaPage',gov:'govPage',projects:'projectsPage'};
  if(!pages[page]) { showNav('home'); return; }
  closeMoreMenu();
  syncScrollLock();
  window.scrollTo(0, 0);
  Object.keys(pages).forEach(function(n) {
    document.getElementById(pages[n]).style.display = 'none';
    var navEl = document.getElementById('nav-'+n);
    if(navEl) navEl.classList.remove('active');
    var snavEl = document.getElementById('snav-'+n);
    if(snavEl) snavEl.classList.remove('active');
  });
  var el = document.getElementById(pages[page]);
  el.style.display = 'block';
  if(page !== 'home') {
    el.classList.add('slide-up');
    setTimeout(function(){ el.classList.remove('slide-up'); }, 300);
  }
  var activeNav = document.getElementById('nav-'+page);
  if(activeNav) activeNav.classList.add('active');
  var activeSNav = document.getElementById('snav-'+page);
  if(activeSNav) activeSNav.classList.add('active');
  var fab = document.getElementById('fab');
  if(fab) fab.style.display = page === 'home' ? 'flex' : 'none';
  var fabScanEl = document.getElementById('fabScan');
  if(fabScanEl) fabScanEl.style.display = page === 'home' ? 'flex' : 'none';

  if(page === 'home') { renderHome(); playHomeAnim(); }
  if(page === 'settings') renderSettings();
  if(page === 'employees') renderEmployeesPage();
  if(page === 'help') renderHelpPage();
  if(page === 'fleet') renderFleetPage();
  if(page === 'contacts') renderContactsPage();
  if(page === 'agenda') renderAgendaPage();
  if(page === 'gov') renderGovPage();
  if(page === 'projects') renderProjectsPage();
}

// ── MORE MENU (mobile) ──
function moreBackBtnHtml() {
  return '<button type="button" class="more-back-btn" onclick="showNav(\'home\')">' + svgIcon('chevronLeft', 20) + '</button>';
}






var MORE_MENU_L = {
  manage: {en:'Manage', ar:'إدارة', de:'Verwalten'},
  tools: {en:'Tools', ar:'أدوات', de:'Werkzeuge'},
  support: {en:'Support & Settings', ar:'الدعم والإعدادات', de:'Support & Einstellungen'},
  clients: {en:'Clients', ar:'العملاء', de:'Kunden'},
  reports: {en:'Reports', ar:'التقارير', de:'Berichte'},
  debts: {en:'Debts', ar:'الديون', de:'Schulden'},
  suppliers: {en:'Suppliers', ar:'الموردون', de:'Lieferanten'},
  employees: {en:'Employees', ar:'الموظفين', de:'Mitarbeiter'},
  fixed: {en:'Fixed', ar:'ثابت', de:'Fix'},
  fleet: {en:'Fleet', ar:'الأسطول', de:'Fuhrpark'},
  assets: {en:'Assets', ar:'الأصول', de:'Vermögenswerte'},
  inventory: {en:'Inventory', ar:'المخزون', de:'Lagerbestand'},
  kalender: {en:'Calendar', ar:'التقويم', de:'Kalender'},
  notizen: {en:'Notes', ar:'الملاحظات', de:'Notizen'},
  archive: {en:'Archive', ar:'الأرشيف', de:'Archiv'},
  contacts: {en:'Contacts', ar:'جهات الاتصال', de:'Kontakte'},
  agenda: {en:'Daily Log', ar:'سجل الأعمال اليومي', de:'Tagesprotokoll'},
  scanInvoices: {en:'Scan Invoices', ar:'مسح الفواتير', de:'Rechnungen scannen'},
  settings: {en:'Settings', ar:'الإعدادات', de:'Einstellungen'},
  help: {en:'Help', ar:'مساعدة', de:'Hilfe'}
};
function mtx(k) { return (MORE_MENU_L[k] && MORE_MENU_L[k][state.lang]) || (MORE_MENU_L[k] && MORE_MENU_L[k].en) || k; }



function closeMoreMenu() {
  var overlay = document.getElementById('moreMenuOverlay');
  if(overlay) overlay.style.display = 'none';
}

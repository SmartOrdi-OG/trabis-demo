// ── HELP PAGE ──
var HELP_L = {
  title: {en:'Help', ar:'مساعدة', de:'Hilfe'},
  secBasics: {en:'Getting Started', ar:'البدء', de:'Erste Schritte'},
  secTax: {en:'Tax & Reports', ar:'الضرائب والتقارير', de:'Steuer & Berichte'},
  secTeam: {en:'Team & Assets', ar:'الفريق والأصول', de:'Team & Vermögenswerte'},
  secLinks: {en:'Useful Links', ar:'روابط مفيدة', de:'Nützliche Links'},
  linkBruttoNetto: {en:'Austrian BMF Gross-Net Salary Calculator', ar:'حاسبة صافي راتب الموظف (BMF النمساوية)', de:'BMF Brutto-Netto-Rechner'},
  linkTarifrechner: {en:'Austrian Social Insurance Tariff Calculator', ar:'حاسبة التأمين الاجتماعي النمساوية (Tarifrechner)', de:'Sozialversicherung Tarifrechner'},
  secCal: {en:'Calendar & Notes', ar:'التقويم والملاحظات', de:'Kalender & Notizen'},
  secData: {en:'Data & Backup', ar:'البيانات والنسخ الاحتياطي', de:'Daten & Backup'},
  secFaq: {en:'Frequently Asked Questions', ar:'الأسئلة الشائعة', de:'Häufig gestellte Fragen'},
  support: {en:'Support', ar:'الدعم', de:'Support'},
  about: {en:'About', ar:'حول', de:'Über'},

  addTx: {en:'How to add a transaction', ar:'كيفية إضافة معاملة', de:'Wie man eine Transaktion hinzufügt'},
  createInv: {en:'How to create an invoice', ar:'كيفية إنشاء فاتورة', de:'Wie man eine Rechnung erstellt'},
  addClients: {en:'How to add clients & suppliers', ar:'كيفية إضافة عملاء وموردين', de:'Wie man Kunden & Lieferanten hinzufügt'},
  uva: {en:'Understanding the UVA report & Approval', ar:'فهم تقرير UVA ونظام الاعتماد', de:'Der UVA-Bericht & die Freigabe'},
  exportReports: {en:'Export reports (PDF & Excel)', ar:'تصدير التقارير (PDF و Excel)', de:'Berichte exportieren (PDF & Excel)'},
  accountantAccess: {en:'Give your accountant access', ar:'إعطاء المحاسب صلاحية دخول', de:'Zugang für Ihren Steuerberater'},
  employees: {en:'Manage employees & work hours', ar:'إدارة الموظفين وساعات العمل', de:'Mitarbeiter & Arbeitszeiten verwalten'},
  fleet: {en:'Track your fleet', ar:'تتبع الأسطول', de:'Fuhrpark verwalten'},
  inventory: {en:'Manage inventory', ar:'إدارة المخزون', de:'Lagerbestand verwalten'},
  assets: {en:'Track assets & depreciation', ar:'تتبع الأصول والإهلاك', de:'Vermögenswerte & Abschreibung'},
  appointments: {en:'Appointments & reminders', ar:'المواعيد والتنبيهات', de:'Termine & Erinnerungen'},
  notes: {en:'Notes', ar:'الملاحظات', de:'Notizen'},
  backup: {en:'Backup & restore your data', ar:'نسخ واسترجاع بياناتك', de:'Daten sichern & wiederherstellen'},
  prefs: {en:'Change language, currency & business type', ar:'تغيير اللغة والعملة ونوع النشاط', de:'Sprache, Währung & Unternehmensart ändern'},

  feedback: {en:'Send Feedback', ar:'إرسال ملاحظات', de:'Feedback senden'},
  contact: {en:'Contact Support', ar:'التواصل مع الدعم', de:'Support kontaktieren'},
  privacy: {en:'Privacy Policy', ar:'سياسة الخصوصية', de:'Datenschutzrichtlinie'},
  terms: {en:'Terms of Use', ar:'شروط الاستخدام', de:'Nutzungsbedingungen'},

  addTxSteps: {
    en:'1. Tap the + button (or a Quick Add card) on Home.\n2. Choose Income or Expense.\n3. Enter the amount, category and date.\n4. Save.',
    ar:'1. اضغط على زر + (أو بطاقة الإضافة السريعة) في الرئيسية.\n2. اختر دخل أو مصروف.\n3. أدخل المبلغ والفئة والتاريخ.\n4. احفظ.',
    de:'1. Tippen Sie auf die Schaltfläche + (oder eine Schnellzugriffskarte) auf der Startseite.\n2. Wählen Sie Einnahme oder Ausgabe.\n3. Geben Sie Betrag, Kategorie und Datum ein.\n4. Speichern.'
  },
  createInvSteps: {
    en:'1. Go to Invoices.\n2. Tap + New Invoice.\n3. Select a client and add items.\n4. Save, then print or share.',
    ar:'1. اذهب إلى الفواتير.\n2. اضغط على + فاتورة جديدة.\n3. اختر عميلاً وأضف العناصر.\n4. احفظ ثم اطبع أو شارك.',
    de:'1. Gehen Sie zu Rechnungen.\n2. Tippen Sie auf + Neue Rechnung.\n3. Wählen Sie einen Kunden und fügen Sie Positionen hinzu.\n4. Speichern, dann drucken oder teilen.'
  },
  addClientsSteps: {
    en:'1. Go to Clients or Suppliers.\n2. Tap + Add.\n3. Enter their details.\n4. Save.',
    ar:'1. اذهب إلى العملاء أو الموردين.\n2. اضغط على + إضافة.\n3. أدخل بياناتهم.\n4. احفظ.',
    de:'1. Gehen Sie zu Kunden oder Lieferanten.\n2. Tippen Sie auf + Hinzufügen.\n3. Geben Sie deren Daten ein.\n4. Speichern.'
  },
  uvaSteps: {
    en:'1. Go to Reports and open the UVA card.\n2. Choose your reporting interval: monthly, quarterly or yearly.\n3. Pick the period to review — every period is listed, even ones with no transactions yet.\n4. Check the KZ figures (000, 022, 006, 029, 060, 095) against your transactions’ VAT rates.\n5. Once the numbers are final for that period, tap Approve to lock it — this blocks editing any transaction in that period unless you revoke the approval first.\n6. Export as PDF or Excel to send to your accountant.',
    ar:'1. اذهب لـ التقارير وافتح كارت UVA.\n2. اختر فترة التقرير: شهري أو ربع سنوي أو سنوي.\n3. اختر الفترة اللي عايز تراجعها — كل الفترات ظاهرة حتى لو مفيهاش معاملات لسه.\n4. راجع أرقام الخانات (000, 022, 006, 029, 060, 095) بناءً على نسب الضريبة في معاملاتك.\n5. لما تتأكد إن الأرقام نهائية للفترة دي، اضغط اعتماد عشان تقفلها — ده بيمنع تعديل أي معاملة في الفترة دي من غير ما تلغي الاعتماد الأول.\n6. صدّر PDF أو Excel عشان تبعتها لمحاسبك.',
    de:'1. Gehen Sie zu Berichte und öffnen Sie die UVA-Karte.\n2. Wählen Sie das Meldeintervall: monatlich, vierteljährlich oder jährlich.\n3. Wählen Sie den gewünschten Zeitraum — alle Zeiträume werden angezeigt, auch ohne Transaktionen.\n4. Prüfen Sie die Kennzahlen (000, 022, 006, 029, 060, 095) anhand der MwSt.-Sätze Ihrer Transaktionen.\n5. Sobald die Zahlen final sind, tippen Sie auf Freigabe, um den Zeitraum zu sperren — danach kann keine Transaktion in diesem Zeitraum geändert werden, ohne die Freigabe zuerst zu widerrufen.\n6. Exportieren Sie als PDF oder Excel für Ihren Steuerberater.'
  },
  exportReportsSteps: {
    en:'1. Go to Reports.\n2. Choose a time period (Today, Week, Month, Year or Custom).\n3. Tap PDF for a printable summary.',
    ar:'1. اذهب لـ التقارير.\n2. اختر الفترة الزمنية (اليوم، الأسبوع، الشهر، السنة أو مخصص).\n3. اضغط PDF لملخص جاهز للطباعة.',
    de:'1. Gehen Sie zu Berichte.\n2. Wählen Sie einen Zeitraum (Heute, Woche, Monat, Jahr oder Benutzerdefiniert).\n3. Tippen Sie auf PDF für eine druckbare Zusammenfassung.'
  },
  accountantAccessSteps: {
    en:'1. On the login page, tap "Log in as Accountant".\n2. Your accountant signs in with the credentials you give them and picks your business from the list.\n3. They see a read-only, German-language view of your transactions, invoices, UVA, employees and assets — they cannot change anything.\n4. This only works from the same browser/device where you use Trabis, since your data never leaves your device.',
    ar:'1. من صفحة تسجيل الدخول، اضغط "تسجيل الدخول كمحاسب".\n2. المحاسب بيدخل ببيانات دخول تديله إياها، ويختار اسم بيزنسك من القائمة.\n3. هيشوف نسخة بالألماني قراءة فقط من معاملاتك وفواتيرك وتقرير UVA وموظفينك وأصولك — مش هيقدر يعدل أي حاجة.\n4. الميزة دي بتشتغل بس من نفس المتصفح/الجهاز اللي بتستخدم Trabis عليه، لأن بياناتك مابتطلعش من جهازك خالص.',
    de:'1. Tippen Sie auf der Anmeldeseite auf "Als Buchhalter anmelden".\n2. Ihr Steuerberater meldet sich mit den von Ihnen bereitgestellten Zugangsdaten an und wählt Ihr Unternehmen aus der Liste.\n3. Er sieht eine schreibgeschützte, deutschsprachige Ansicht Ihrer Transaktionen, Rechnungen, UVA, Mitarbeiter und Vermögenswerte — er kann nichts ändern.\n4. Dies funktioniert nur über denselben Browser/dasselbe Gerät, auf dem Sie Trabis verwenden, da Ihre Daten Ihr Gerät nie verlassen.'
  },
  employeesSteps: {
    en:'1. Go to Employees (from the More menu).\n2. Tap + Add Employee and enter their name, position and Brutto (gross) salary — Trabis doesn’t calculate Netto, that’s your accountant’s job.\n3. Open an employee’s profile to upload documents (contract, ID, visa) with expiry dates — you’ll get a reminder 30 days before they expire.\n4. Use "Work Hours" on their profile to log hours per period — either a total, or a start/end time with a break.',
    ar:'1. اذهب لـ الموظفين (من قائمة المزيد).\n2. اضغط + إضافة موظف وأدخل اسمه ووظيفته والمرتب Brutto (الإجمالي) — Trabis مش بيحسب Netto، ده شغل محاسبك.\n3. افتح بروفايل الموظف عشان ترفع مستندات (عقد، هوية، فيزا) بتاريخ انتهاء — هتوصلك تذكرة قبل الانتهاء بـ 30 يوم.\n4. استخدم "ساعات العمل" في بروفايله عشان تسجل الساعات لكل فترة — إما إجمالي، أو وقت بداية/نهاية مع استراحة.',
    de:'1. Gehen Sie zu Mitarbeiter (im Menü Mehr).\n2. Tippen Sie auf + Mitarbeiter hinzufügen und geben Sie Name, Position und Bruttogehalt ein — Trabis berechnet kein Netto, das ist Aufgabe Ihres Steuerberaters.\n3. Öffnen Sie das Profil eines Mitarbeiters, um Dokumente (Vertrag, Ausweis, Visum) mit Ablaufdatum hochzuladen — Sie erhalten 30 Tage vorher eine Erinnerung.\n4. Nutzen Sie "Arbeitszeiten" im Profil, um Stunden pro Zeitraum zu erfassen — entweder gesamt, oder mit Start-/Endzeit und Pause.'
  },
  fleetSteps: {
    en:'1. Go to Fleet (visible for Transport businesses).\n2. Tap + Add Vehicle and enter the plate number, name and type.\n3. Open a vehicle’s profile to upload documents (Pickerl, insurance) with expiry dates, log maintenance costs, and link a purchase price/date to calculate its depreciation automatically.',
    ar:'1. اذهب لـ الأسطول (بتظهر لأصحاب نشاط النقل).\n2. اضغط + إضافة عربية وأدخل رقم اللوحة والاسم والنوع.\n3. افتح بروفايل العربية عشان ترفع مستندات (بيكرل، تأمين) بتاريخ انتهاء، وتسجل تكاليف الصيانة، وتربط سعر وتاريخ الشراء عشان يتحسب الإهلاك أوتوماتيك.',
    de:'1. Gehen Sie zu Fuhrpark (sichtbar für Transportunternehmen).\n2. Tippen Sie auf + Fahrzeug hinzufügen und geben Sie Kennzeichen, Name und Typ ein.\n3. Öffnen Sie das Fahrzeugprofil, um Dokumente (Pickerl, Versicherung) mit Ablaufdatum hochzuladen, Wartungskosten zu erfassen und Kaufpreis/-datum zu verknüpfen, damit die Abschreibung automatisch berechnet wird.'
  },
  inventorySteps: {
    en:'1. Go to Inventory (visible for Retail businesses).\n2. Tap + Add Product and enter its name, purchase/sell price, quantity and a low-stock threshold.\n3. When you record an income or expense, you can link it to a product and quantity — stock adjusts automatically, and you’ll get an alert when it runs low.',
    ar:'1. اذهب لـ المخزون (بتظهر لأصحاب نشاط التجزئة).\n2. اضغط + إضافة منتج وأدخل اسمه وسعر الشراء/البيع والكمية وحد التنبيه لنفاد المخزون.\n3. لما تسجل دخل أو مصروف، تقدر تربطه بمنتج وكمية — المخزون بيتحدث أوتوماتيك، وهتوصلك تنبيه لو المخزون قرب يخلص.',
    de:'1. Gehen Sie zu Lagerbestand (sichtbar für Einzelhandelsunternehmen).\n2. Tippen Sie auf + Produkt hinzufügen und geben Sie Name, Einkaufs-/Verkaufspreis, Menge und eine Mindestbestandsgrenze ein.\n3. Beim Erfassen einer Einnahme oder Ausgabe können Sie ein Produkt und eine Menge verknüpfen — der Bestand wird automatisch angepasst, und Sie erhalten eine Warnung bei niedrigem Bestand.'
  },
  assetsSteps: {
    en:'1. Go to Assets (from the More menu) — available to all business types.\n2. Tap + Add Asset for equipment, furniture etc., or link a vehicle’s purchase price/date/rate from its Fleet profile — it appears here automatically.\n3. Trabis calculates the monthly depreciation and current book value for each asset using straight-line depreciation.',
    ar:'1. اذهب لـ الأصول (من قائمة المزيد) — متاحة لكل أنواع النشاط.\n2. اضغط + إضافة أصل للمعدات أو الأثاث... إلخ، أو اربط سعر/تاريخ/نسبة شراء عربية من بروفايلها في الأسطول — هتظهر هنا أوتوماتيك.\n3. Trabis بيحسب الإهلاك الشهري والقيمة الدفترية الحالية لكل أصل باستخدام طريقة القسط الثابت.',
    de:'1. Gehen Sie zu Vermögenswerte (im Menü Mehr) — verfügbar für alle Unternehmensarten.\n2. Tippen Sie auf + Vermögenswert hinzufügen für Ausstattung, Möbel usw., oder verknüpfen Sie Kaufpreis/-datum/-satz eines Fahrzeugs über sein Fuhrpark-Profil — es erscheint dann automatisch hier.\n3. Trabis berechnet die monatliche Abschreibung und den aktuellen Buchwert für jeden Vermögenswert linear.'
  },
  appointmentsSteps: {
    en:'1. Go to Calendar (from the More menu).\n2. Tap + Appointment, enter a title, date, time and type, and set a reminder.\n3. Document expiry dates for employees and vehicles appear here automatically with a 30-day advance reminder — no need to add them manually.',
    ar:'1. اذهب لـ التقويم (من قائمة المزيد).\n2. اضغط + موعد، وأدخل العنوان والتاريخ والوقت والنوع، واختر تذكير.\n3. تواريخ انتهاء مستندات الموظفين والعربيات بتظهر هنا أوتوماتيك مع تذكير قبل 30 يوم — مش محتاج تضيفها يدوي.',
    de:'1. Gehen Sie zu Kalender (im Menü Mehr).\n2. Tippen Sie auf + Termin, geben Sie Titel, Datum, Uhrzeit und Typ ein und stellen Sie eine Erinnerung ein.\n3. Ablaufdaten von Mitarbeiter- und Fahrzeugdokumenten erscheinen hier automatisch mit einer Erinnerung 30 Tage im Voraus — keine manuelle Eingabe nötig.'
  },
  notesSteps: {
    en:'1. Go to Notes (from the More menu).\n2. Tap + to create a note with text, an image, a PDF, or checklist items.\n3. Notes are private to your account and stay on this device, just like the rest of your data.',
    ar:'1. اذهب لـ الملاحظات (من قائمة المزيد).\n2. اضغط + عشان تعمل ملاحظة فيها نص أو صورة أو PDF أو عناصر تشيك ليست.\n3. الملاحظات خاصة بحسابك وفاضلة على الجهاز ده بس، زي باقي بياناتك.',
    de:'1. Gehen Sie zu Notizen (im Menü Mehr).\n2. Tippen Sie auf +, um eine Notiz mit Text, Bild, PDF oder Checklistenpunkten zu erstellen.\n3. Notizen sind privat für Ihr Konto und bleiben auf diesem Gerät, wie der Rest Ihrer Daten.'
  },
  backupSteps: {
    en:'1. Go to Settings → Data Management.\n2. Tap Export Backup to save a JSON file with all your data — keep it somewhere safe.\n3. On a new device or after clearing your browser, use Import Backup to restore everything from that file.\n4. Since Trabis stores data only on this device, doing regular backups is the only way to protect against data loss.',
    ar:'1. اذهب لـ الإعدادات ← إدارة البيانات.\n2. اضغط تصدير نسخة احتياطية عشان تحفظ ملف JSON فيه كل بياناتك — احفظه في مكان آمن.\n3. على جهاز جديد أو بعد مسح بيانات المتصفح، استخدم استيراد نسخة احتياطية عشان ترجع كل حاجة من الملف ده.\n4. بما إن Trabis بيخزن البيانات على الجهاز بس، عمل نسخ احتياطي بانتظام هو الطريقة الوحيدة إنك متفقدش بياناتك.',
    de:'1. Gehen Sie zu Einstellungen → Datenverwaltung.\n2. Tippen Sie auf Backup exportieren, um eine JSON-Datei mit all Ihren Daten zu speichern — bewahren Sie sie sicher auf.\n3. Nutzen Sie auf einem neuen Gerät oder nach dem Löschen der Browserdaten Backup importieren, um alles aus dieser Datei wiederherzustellen.\n4. Da Trabis Daten nur auf diesem Gerät speichert, sind regelmäßige Backups der einzige Schutz vor Datenverlust.'
  },
  prefsSteps: {
    en:'1. Go to Settings.\n2. Under App Preferences, change your language, currency, dark/light theme or date format at any time.\n3. Under Account, you can change your Business Type (e.g. General to Transport) to show or hide Fleet/Inventory — your existing data is never deleted when you switch.',
    ar:'1. اذهب لـ الإعدادات.\n2. تحت تفضيلات التطبيق، غيّر اللغة أو العملة أو الوضع الداكن/الفاتح أو شكل التاريخ في أي وقت.\n3. تحت الحساب، تقدر تغيّر نوع نشاطك (مثلاً من عام لنقل) عشان يظهر أو يختفي الأسطول/المخزون — بياناتك الموجودة مابتتمسحش أبداً لما تغيّر.',
    de:'1. Gehen Sie zu Einstellungen.\n2. Ändern Sie unter App-Einstellungen jederzeit Sprache, Währung, Dunkel-/Hellmodus oder Datumsformat.\n3. Unter Konto können Sie Ihre Unternehmensart ändern (z. B. von Allgemein zu Transport), um Fuhrpark/Lagerbestand ein- oder auszublenden — Ihre bestehenden Daten werden beim Wechsel nie gelöscht.'
  },

  faq1q: {en:'Is my data stored online?', ar:'هل بياناتي مخزنة أونلاين؟', de:'Werden meine Daten online gespeichert?'},
  faq1a: {en:'No. Everything you enter — transactions, invoices, employees — stays only in this browser on this device. Trabis has no server and never uploads your data anywhere.', ar:'لأ. كل حاجة بتدخلها — معاملات، فواتير، موظفين — بتفضل بس في المتصفح ده على الجهاز ده. Trabis مالوش سيرفر وأبداً مابيرفعش بياناتك لأي مكان.', de:'Nein. Alles, was Sie eingeben — Transaktionen, Rechnungen, Mitarbeiter — bleibt ausschließlich in diesem Browser auf diesem Gerät. Trabis hat keinen Server und lädt Ihre Daten niemals hoch.'},
  faq2q: {en:'Can my accountant change my data?', ar:'المحاسب يقدر يعدل بياناتي؟', de:'Kann mein Steuerberater meine Daten ändern?'},
  faq2a: {en:'No. The accountant portal is completely read-only — there is no save function in that file at all. They can view and download reports, but can never edit, add or delete anything.', ar:'لأ. واجهة المحاسب قراءة فقط بالكامل — مفيش أي دالة حفظ في الملف ده خالص. يقدر يشوف ويحمّل التقارير بس، وأبداً مايقدرش يعدل أو يضيف أو يمسح حاجة.', de:'Nein. Das Buchhalter-Portal ist vollständig schreibgeschützt — es gibt in dieser Datei überhaupt keine Speicherfunktion. Er kann Berichte ansehen und herunterladen, aber nie etwas bearbeiten, hinzufügen oder löschen.'},
  faq3q: {en:'What happens if I change my business type?', ar:'هيحصل إيه لو غيرت نوع نشاطي؟', de:'Was passiert, wenn ich meine Unternehmensart ändere?'},
  faq3a: {en:'Switching business type (e.g. General to Transport) only shows or hides the matching tools like Fleet or Inventory. None of your existing data is ever deleted when you switch.', ar:'تغيير نوع النشاط (مثلاً من عام لنقل) بيظهر أو يخفي بس الأدوات المرتبطة زي الأسطول أو المخزون. بياناتك الموجودة مابتتمسحش أبداً لما تغيّر.', de:'Der Wechsel der Unternehmensart (z. B. von Allgemein zu Transport) zeigt oder verbirgt nur die passenden Tools wie Fuhrpark oder Lagerbestand. Keine Ihrer bestehenden Daten wird beim Wechsel gelöscht.'},
  faq4q: {en:'What happens if I clear my browser data?', ar:'هيحصل إيه لو مسحت بيانات المتصفح؟', de:'Was passiert, wenn ich meine Browserdaten lösche?'},
  faq4a: {en:'Since everything is stored locally, clearing your browser’s site data or history will permanently delete your Trabis data too. Export a backup regularly (Settings → Data Management) so you can restore it if this happens.', ar:'بما إن كل حاجة متخزنة محليًا، مسح بيانات الموقع أو الهيستوري من المتصفح هيمسح بيانات Trabis كمان نهائيًا. اعمل نسخة احتياطية بانتظام (الإعدادات ← إدارة البيانات) عشان تقدر ترجعها لو حصل كده.', de:'Da alles lokal gespeichert wird, löscht das Löschen der Website-Daten oder des Verlaufs Ihres Browsers auch Ihre Trabis-Daten dauerhaft. Exportieren Sie regelmäßig ein Backup (Einstellungen → Datenverwaltung), um es wiederherstellen zu können.'},
  faq5q: {en:'Can I use Trabis on more than one device?', ar:'أقدر أستخدم Trabis على أكتر من جهاز؟', de:'Kann ich Trabis auf mehreren Geräten verwenden?'},
  faq5a: {en:'Not automatically — your data lives only on the device/browser you entered it on. To move to a new device, export a backup on the old one and import it on the new one.', ar:'مش أوتوماتيك — بياناتك موجودة بس على الجهاز/المتصفح اللي دخلتها بيه. عشان تنقل لجهاز جديد، صدّر نسخة احتياطية من القديم واستوردها في الجديد.', de:'Nicht automatisch — Ihre Daten existieren nur auf dem Gerät/Browser, auf dem Sie sie eingegeben haben. Um zu einem neuen Gerät zu wechseln, exportieren Sie ein Backup auf dem alten und importieren Sie es auf dem neuen.'}
};
function htx(k) { return (HELP_L[k] && HELP_L[k][state.lang]) || (HELP_L[k] && HELP_L[k].en) || k; }

function helpStepsHtml(text) {
  var lines = String(text).split('\n').filter(function(l){ return l.trim(); });
  var cs = 'background:#fff;border-radius:12px;padding:20px 24px;box-shadow:0 1px 4px rgba(0,0,0,0.06)';
  var h = '<div style="' + cs + '">';
  lines.forEach(function(line) {
    var m = line.match(/^(\d+)\.\s*(.*)$/);
    var num = m ? m[1] : '•';
    var txt = m ? m[2] : line;
    h += '<div style="display:flex;gap:12px;margin-bottom:14px;align-items:flex-start">'
      + '<div style="flex-shrink:0;width:24px;height:24px;border-radius:50%;background:#0061a4;color:#fff;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center">' + num + '</div>'
      + '<div style="flex:1;font-size:14px;color:#475569;line-height:1.7;padding-top:2px">' + txt + '</div>'
      + '</div>';
  });
  h += '</div>';
  return h;
}
function openHelpDetail(titleKey, stepsKey) {
  openLegalOverlay(htx(titleKey), htx('secBasics'), helpStepsHtml(htx(stepsKey)));
}

function renderHelpPage() {
  var page = document.getElementById('helpPage');
  if(!page) return;

  function helpRow(id, label) {
    return '<div id="' + id + '" style="display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-bottom:1px solid var(--border);font-size:14px;color:var(--text);cursor:pointer">'
      + '<span>' + label + '</span>'
      + svgIcon('chevronRight', 16)
      + '</div>';
  }
  function helpLinkRow(id, label) {
    return '<div id="' + id + '" style="display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-bottom:1px solid var(--border);font-size:14px;color:var(--text);cursor:pointer">'
      + '<span>' + label + '</span>'
      + '<span style="color:var(--text3)">' + svgIcon('externalLink', 15) + '</span>'
      + '</div>';
  }
  function helpSectionTitle(label) {
    return '<div style="font-size:12px;font-weight:700;color:var(--text3);text-transform:uppercase;letter-spacing:0.5px;padding:16px 16px 4px">' + label + '</div>';
  }
  function faqRow(qKey, aKey) {
    return '<div class="help-faq-item" style="border-bottom:1px solid var(--border)">'
      + '<div class="help-faq-q" data-a="help-faq-a-' + qKey + '" style="display:flex;align-items:center;justify-content:space-between;padding:14px 16px;font-size:14px;font-weight:600;color:var(--text);cursor:pointer">'
      + '<span>' + htx(qKey) + '</span>'
      + '<span class="help-faq-chevron" style="transition:transform 0.2s;display:flex">' + svgIcon('chevronRight', 16) + '</span>'
      + '</div>'
      + '<div id="help-faq-a-' + qKey + '" style="display:none;padding:0 16px 16px;font-size:13px;color:var(--text2);line-height:1.6">' + htx(aKey) + '</div>'
      + '</div>';
  }

  var h = '<div style="padding-bottom:120px">';
  h += '<div style="padding:16px 16px 0;display:flex;align-items:center;gap:8px">' + moreBackBtnHtml() + '<div style="font-size:18px;font-weight:700">' + htx('title') + '</div></div>';

  h += helpSectionTitle(htx('secBasics'));
  h += helpRow('help-add-tx', htx('addTx'));
  h += helpRow('help-create-inv', htx('createInv'));


  h += helpSectionTitle(htx('secTeam'));
  h += helpRow('help-employees', htx('employees'));
  if(state.businessType === 'transport') h += helpRow('help-fleet', htx('fleet'));

  h += helpSectionTitle(htx('secLinks'));
  h += helpLinkRow('help-link-brutto-netto', htx('linkBruttoNetto'));
  h += helpLinkRow('help-link-tarifrechner', htx('linkTarifrechner'));

  h += helpSectionTitle(htx('secCal'));
  h += helpRow('help-appointments', htx('appointments'));

  h += helpSectionTitle(htx('secData'));
  h += helpRow('help-backup', htx('backup'));
  h += helpRow('help-prefs', htx('prefs'));

  h += helpSectionTitle(htx('secFaq'));
  h += '<div style="background:var(--card);border-radius:12px;overflow:hidden">'
    + faqRow('faq1q', 'faq1a') + faqRow('faq2q', 'faq2a') + faqRow('faq3q', 'faq3a') + faqRow('faq4q', 'faq4a') + faqRow('faq5q', 'faq5a')
    + '</div>';

  h += helpSectionTitle(htx('support'));
  h += helpRow('help-feedback', htx('feedback'));
  h += helpRow('help-contact', htx('contact'));
  h += helpRow('help-privacy', htx('privacy'));
  h += helpRow('help-terms', htx('terms'));

  h += helpSectionTitle(htx('about'));
  h += '<div style="padding:14px 16px;font-size:14px;color:var(--text)">Trabis v1.5</div>';
  h += '<div style="padding:0 16px 14px;font-size:12px;color:var(--text3)">Smartordi OG · Steingasse 6a, 4020 Linz</div>';
  h += '</div>';

  page.innerHTML = h;

  var addTxBtn = document.getElementById('help-add-tx');
  if(addTxBtn) addTxBtn.onclick = function(){ openHelpDetail('addTx', 'addTxSteps'); };
  var createInvBtn = document.getElementById('help-create-inv');
  if(createInvBtn) createInvBtn.onclick = function(){ openHelpDetail('createInv', 'createInvSteps'); };
  var employeesBtn = document.getElementById('help-employees');
  if(employeesBtn) employeesBtn.onclick = function(){ openHelpDetail('employees', 'employeesSteps'); };
  var fleetBtn = document.getElementById('help-fleet');
  if(fleetBtn) fleetBtn.onclick = function(){ openHelpDetail('fleet', 'fleetSteps'); };
  var bruttoNettoBtn = document.getElementById('help-link-brutto-netto');
  if(bruttoNettoBtn) bruttoNettoBtn.onclick = function(){ window.open('https://onlinerechner.haude.at/BMF-Brutto-Netto-Rechner/', '_blank', 'noopener'); };
  var tarifrechnerBtn = document.getElementById('help-link-tarifrechner');
  if(tarifrechnerBtn) tarifrechnerBtn.onclick = function(){ window.open('https://www.sozialversicherung.at/trechner/views/tarifrechner.xhtml', '_blank', 'noopener'); };
  var appointmentsBtn = document.getElementById('help-appointments');
  if(appointmentsBtn) appointmentsBtn.onclick = function(){ openHelpDetail('appointments', 'appointmentsSteps'); };
  var backupBtn = document.getElementById('help-backup');
  if(backupBtn) backupBtn.onclick = function(){ openHelpDetail('backup', 'backupSteps'); };
  var prefsBtn = document.getElementById('help-prefs');
  if(prefsBtn) prefsBtn.onclick = function(){ openHelpDetail('prefs', 'prefsSteps'); };

  page.querySelectorAll('.help-faq-q').forEach(function(row) {
    row.onclick = function() {
      var aEl = document.getElementById(row.getAttribute('data-a'));
      var chevron = row.querySelector('.help-faq-chevron');
      if(!aEl) return;
      var open = aEl.style.display === 'block';
      aEl.style.display = open ? 'none' : 'block';
      if(chevron) chevron.style.transform = open ? 'rotate(0deg)' : 'rotate(90deg)';
    };
  });

  var feedbackBtn = document.getElementById('help-feedback');
  if(feedbackBtn) feedbackBtn.onclick = function(){ window.location.href = 'mailto:team@smartordi.eu'; };
  var contactBtn = document.getElementById('help-contact');
  if(contactBtn) contactBtn.onclick = function(){ window.location.href = 'mailto:team@smartordi.eu?subject=Trabis Support'; };
  var privacyBtn = document.getElementById('help-privacy');
  if(privacyBtn) privacyBtn.onclick = function(){ openPrivacy(); };
  var termsBtn = document.getElementById('help-terms');
  if(termsBtn) termsBtn.onclick = function(){ openTerms(); };
}

// ── KALENDER ──
var KAL_L = {
  addAppt:  {en:'+ Appointment', ar:'+ موعد', de:'+ Termin'},
  noAppts:  {en:'No appointments for this day', ar:'لا مواعيد لهذا اليوم', de:'Keine Termine für diesen Tag'},
  edit:     {en:'Edit', ar:'تعديل', de:'Bearbeiten'},
  del:      {en:'Delete', ar:'حذف', de:'Löschen'},
  confirmDelete: {en:'Delete this appointment?', ar:'حذف هذا الموعد؟', de:'Diesen Termin löschen?'},
  docExpires: {en:' - Document expires', ar:' - انتهاء صلاحية المستند', de:' - Dokument läuft ab'},
};
function kaltx(k) { return (KAL_L[k] && KAL_L[k][state.lang]) || (KAL_L[k] && KAL_L[k].en) || k; }

var KAL_MONTH_NAMES = {
  en: ['January','February','March','April','May','June','July','August','September','October','November','December'],
  ar: ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'],
  de: ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'],
};
var KAL_DAY_NAMES = {
  en: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
  ar: ['اثنين','ثلاثاء','أربعاء','خميس','جمعة','سبت','أحد'],
  de: ['Mo','Di','Mi','Do','Fr','Sa','So'],
};
var KAL_TYPE_COLORS = {personal:'#006e1c', business:'#2563eb', document:'#f59e0b', vehicle:'#bb1614'};

var _kalYear = null;
var _kalMonth = null;
var _kalSelectedDate = null;

function generateAutoAppointments() {
  var list = [];
  var suffix = kaltx('docExpires');
  (state.employees || []).forEach(function(emp) {
    var empName = emp.fullName || emp.name || '';
    if(emp.workPermitExpiry) {
      list.push({id:'auto-emp-'+emp.id+'-workPermit', title:empName+suffix, date:String(emp.workPermitExpiry).substring(0,10), time:'', type:'document', description:'', isAuto:true});
    }
    if(emp.drivingLicenseExpiry) {
      list.push({id:'auto-emp-'+emp.id+'-drivingLicense', title:empName+suffix, date:String(emp.drivingLicenseExpiry).substring(0,10), time:'', type:'document', description:'', isAuto:true});
    }
    (emp.documents || []).forEach(function(doc) {
      if(doc.expiryDate) {
        list.push({id:'auto-emp-'+emp.id+'-doc-'+doc.id, title:empName+' — '+(doc.name||'')+suffix, date:String(doc.expiryDate).substring(0,10), time:'', type:'document', description:'', isAuto:true});
      }
    });
  });
  if(state.fleet && state.fleet.length) {
    state.fleet.forEach(function(v) {
      var vName = v.name || v.plate || '';
      ['pickerl','tuev','insurance'].forEach(function(field) {
        if(v[field]) {
          list.push({id:'auto-veh-'+v.id+'-'+field, title:vName+suffix, date:String(v[field]).substring(0,10), time:'', type:'vehicle', description:'', isAuto:true});
        }
      });
      (v.documents || []).forEach(function(doc) {
        if(doc.expiryDate) {
          list.push({id:'auto-veh-'+v.id+'-doc-'+doc.id, title:vName+' — '+(doc.name||'')+suffix, date:String(doc.expiryDate).substring(0,10), time:'', type:'vehicle', description:'', isAuto:true});
        }
      });
    });
  }
  return list;
}

function kalChangeMonth(delta) {
  _kalMonth += delta;
  if(_kalMonth < 0) { _kalMonth = 11; _kalYear--; }
  else if(_kalMonth > 11) { _kalMonth = 0; _kalYear++; }
  renderKalenderPage();
}

async function deleteAppointment(id) {
  if(!(await confirmAsync(DELETE_CONFIRM_TITLE[state.lang]||DELETE_CONFIRM_TITLE.en, kaltx('confirmDelete')))) return;
  state.appointments = state.appointments.filter(function(a){ return a.id !== id; });
  save();
  renderKalenderPage();
}

function renderKalenderPage() {
  var page = document.getElementById('kalenderPage');
  if(!page) return;

  var now = new Date();
  if(_kalYear === null) { _kalYear = now.getFullYear(); _kalMonth = now.getMonth(); }
  if(_kalSelectedDate === null) { _kalSelectedDate = today(); }

  var isRTL = state.lang === 'ar';
  var autoAppts = generateAutoAppointments();
  var allAppts = (state.appointments || []).concat(autoAppts);

  var monthNames = KAL_MONTH_NAMES[state.lang] || KAL_MONTH_NAMES.en;
  var dayNames = KAL_DAY_NAMES[state.lang] || KAL_DAY_NAMES.en;
  var monthLabel = monthNames[_kalMonth] + ' ' + _kalYear;

  var firstOfMonth = new Date(_kalYear, _kalMonth, 1);
  var startWeekday = (firstOfMonth.getDay() + 6) % 7;
  var daysInMonth = new Date(_kalYear, _kalMonth + 1, 0).getDate();
  var daysInPrevMonth = new Date(_kalYear, _kalMonth, 0).getDate();

  var cells = [];
  var pi;
  for(pi = 0; pi < startWeekday; pi++) {
    cells.push({day: daysInPrevMonth - startWeekday + 1 + pi, outside: true, dateStr: null});
  }
  var d;
  for(d = 1; d <= daysInMonth; d++) {
    cells.push({day: d, outside: false, dateStr: _kalYear + '-' + pad2(_kalMonth + 1) + '-' + pad2(d)});
  }
  var remaining = (7 - (cells.length % 7)) % 7;
  var ni;
  for(ni = 1; ni <= remaining; ni++) {
    cells.push({day: ni, outside: true, dateStr: null});
  }

  // Grid items lay out DOM-order left-to-right regardless of dir="rtl", so for
  // Arabic we mirror by reversing each week-row (keeps week order top-to-bottom,
  // flips only the within-row left-right reading order).
  var dayOrder = [0, 1, 2, 3, 4, 5, 6];
  if(isRTL) {
    dayOrder = [6, 5, 4, 3, 2, 1, 0];
    var mirroredCells = [];
    var rowStart;
    for(rowStart = 0; rowStart < cells.length; rowStart += 7) {
      var row = cells.slice(rowStart, rowStart + 7);
      row.reverse();
      mirroredCells = mirroredCells.concat(row);
    }
    cells = mirroredCells;
  }

  var todayStr = today();

  var h = '';
  h += '<div style="position:sticky;top:0;background:var(--bg);z-index:5;padding-bottom:8px">';
  h += moreBackBtnHtml();
  h += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">';
  h += '<button id="kalLeftBtn" style="background:var(--card);border:1px solid var(--border);border-radius:10px;width:36px;height:36px;display:flex;align-items:center;justify-content:center;cursor:pointer">' + svgIcon('chevronLeft', 18) + '</button>';
  h += '<div style="font-size:18px;font-weight:700">' + monthLabel + '</div>';
  h += '<button id="kalRightBtn" style="background:var(--card);border:1px solid var(--border);border-radius:10px;width:36px;height:36px;display:flex;align-items:center;justify-content:center;cursor:pointer">' + svgIcon('chevronRight', 18) + '</button>';
  h += '</div>';
  h += '<button id="kalAddBtn" style="width:100%;background:#0061a4;color:#fff;border:none;border-radius:10px;padding:10px;font-size:14px;font-weight:600;cursor:pointer;margin-bottom:12px">' + kaltx('addAppt') + '</button>';
  h += '</div>';

  h += '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin-bottom:6px">';
  var wi;
  for(wi = 0; wi < 7; wi++) {
    h += '<div style="text-align:center;font-size:12px;font-weight:700;color:var(--text3)">' + dayNames[dayOrder[wi]] + '</div>';
  }
  h += '</div>';

  h += '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin-bottom:16px">';
  cells.forEach(function(cell) {
    var isToday = cell.dateStr === todayStr;
    var isSelected = cell.dateStr === _kalSelectedDate;
    var dayAppts = cell.dateStr ? allAppts.filter(function(a){ return a.date === cell.dateStr; }) : [];
    var dayAgenda = cell.dateStr ? (state.agenda || []).filter(function(a){ return a.date === cell.dateStr; }) : [];
    var dotsHtml = '';
    if(dayAppts.length || dayAgenda.length) {
      var seenTypes = {};
      dayAppts.forEach(function(a){ seenTypes[a.type] = true; });
      dotsHtml = '<div style="display:flex;gap:2px;justify-content:center;margin-top:2px">';
      Object.keys(seenTypes).forEach(function(t) {
        dotsHtml += '<span style="width:5px;height:5px;border-radius:50%;background:' + (KAL_TYPE_COLORS[t] || '#999') + ';display:inline-block"></span>';
      });
      if(dayAgenda.length) dotsHtml += '<span style="width:5px;height:5px;border-radius:50%;background:#8b5cf6;display:inline-block"></span>';
      dotsHtml += '</div>';
    }
    var circleStyle = isToday ? 'background:var(--primary);color:#fff;border-radius:50%' : (isSelected ? 'background:var(--primary-light);border-radius:50%' : '');
    var textColor = cell.outside ? 'color:var(--text3);opacity:0.4' : (isToday ? 'color:#fff' : 'color:var(--text)');
    h += '<div class="kal-day-cell" data-date="' + (cell.dateStr || '') + '" style="text-align:center;padding:6px 0;cursor:' + (cell.outside ? 'default' : 'pointer') + '">';
    h += '<div style="width:28px;height:28px;margin:0 auto;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:600;' + circleStyle + ';' + textColor + '">' + cell.day + '</div>';
    h += dotsHtml || '<div style="height:7px;margin-top:2px"></div>';
    h += '</div>';
  });
  h += '</div>';

  var selectedAppts = allAppts.filter(function(a){ return a.date === _kalSelectedDate; }).sort(function(a, b){ return (a.time || '').localeCompare(b.time || ''); });
  h += '<div id="kalApptsList">';
  if(!selectedAppts.length) {
    h += '<div style="text-align:center;padding:30px;color:var(--text3);font-size:13px">' + kaltx('noAppts') + '</div>';
  } else {
    selectedAppts.forEach(function(a) {
      var color = KAL_TYPE_COLORS[a.type] || '#999';
      var borderSide = isRTL ? 'border-right' : 'border-left';
      h += '<div style="background:var(--card);border-radius:12px;padding:12px 14px;margin-bottom:8px;' + borderSide + ':4px solid ' + color + ';box-shadow:var(--shadow);text-align:' + (isRTL ? 'right' : 'left') + '">';
      h += '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px' + (isRTL ? ';flex-direction:row-reverse' : '') + '">';
      h += '<div style="flex:1;min-width:0">';
      h += '<div style="font-size:14px;font-weight:700;display:flex;align-items:center;gap:6px' + (isRTL ? ';flex-direction:row-reverse;justify-content:flex-end' : '') + '">' + (a.isAuto ? svgIcon('lock', 12) : '') + escHtml(a.title) + '</div>';
      if(a.time) h += '<div style="font-size:12px;color:var(--text3);margin-top:2px">' + a.time + '</div>';
      if(a.description) h += '<div style="font-size:12px;color:var(--text2);margin-top:4px">' + escHtml(a.description) + '</div>';
      h += '</div>';
      if(!a.isAuto) {
        h += '<div style="display:flex;gap:6px;flex-shrink:0">';
        h += '<button class="kal-edit-btn" data-id="' + a.id + '" style="background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:5px 8px;font-size:11px;cursor:pointer;color:var(--text2)">' + kaltx('edit') + '</button>';
        h += '<button class="kal-del-btn" data-id="' + a.id + '" style="background:rgba(239,68,68,0.1);border:none;border-radius:8px;padding:5px 8px;font-size:11px;cursor:pointer;color:#ef4444">' + kaltx('del') + '</button>';
        h += '</div>';
      }
      h += '</div></div>';
    });
  }
  h += '</div>';

  var selectedAgenda = (state.agenda || []).filter(function(a){ return a.date === _kalSelectedDate; }).sort(function(a, b){ return (b.createdAt||0) - (a.createdAt||0); });
  h += '<div style="display:flex;align-items:center;justify-content:space-between;margin:18px 0 10px' + (isRTL ? ';flex-direction:row-reverse' : '') + '">';
  h += '<div style="font-size:15px;font-weight:700">' + agtx('title') + '</div>';
  h += '<button id="kalAgendaAddBtn" style="background:#8b5cf6;color:#fff;border:none;border-radius:8px;padding:6px 12px;font-size:12px;font-weight:600;cursor:pointer">' + agtx('addEntry') + '</button>';
  h += '</div>';
  h += '<div id="kalAgendaList">' + renderAgendaEntriesHtml(selectedAgenda) + '</div>';

  page.innerHTML = h;

  var leftBtn = document.getElementById('kalLeftBtn');
  var rightBtn = document.getElementById('kalRightBtn');
  if(isRTL) {
    if(leftBtn) leftBtn.onclick = function(){ kalChangeMonth(1); };
    if(rightBtn) rightBtn.onclick = function(){ kalChangeMonth(-1); };
  } else {
    if(leftBtn) leftBtn.onclick = function(){ kalChangeMonth(-1); };
    if(rightBtn) rightBtn.onclick = function(){ kalChangeMonth(1); };
  }
  var addBtn = document.getElementById('kalAddBtn');
  if(addBtn) addBtn.onclick = function(){ openAppointmentForm(_kalSelectedDate); };

  var dayCells = page.querySelectorAll('.kal-day-cell');
  var ci;
  for(ci = 0; ci < dayCells.length; ci++) {
    var cellEl = dayCells[ci];
    var cellDate = cellEl.getAttribute('data-date');
    if(!cellDate) continue;
    (function(dd) {
      cellEl.onclick = function(){ _kalSelectedDate = dd; renderKalenderPage(); };
    })(cellDate);
  }

  var editBtns = page.querySelectorAll('.kal-edit-btn');
  var ei;
  for(ei = 0; ei < editBtns.length; ei++) {
    (function(btn) {
      var apptId = parseInt(btn.getAttribute('data-id'), 10);
      btn.onclick = function(){ openAppointmentForm(null, apptId); };
    })(editBtns[ei]);
  }

  var delBtns = page.querySelectorAll('.kal-del-btn');
  var di;
  for(di = 0; di < delBtns.length; di++) {
    (function(btn) {
      var apptId = parseInt(btn.getAttribute('data-id'), 10);
      btn.onclick = function(){ deleteAppointment(apptId); };
    })(delBtns[di]);
  }

  var agendaAddBtn = document.getElementById('kalAgendaAddBtn');
  if(agendaAddBtn) agendaAddBtn.onclick = function(){ openAgendaForm(_kalSelectedDate); };
  wireAgendaEntriesButtons(page);
}

function closeAppointmentForm() {
  var ov = document.getElementById('apptOverlay');
  if(ov) ov.parentNode.removeChild(ov);
}

function openAppointmentForm(date, editId) {
  var existingOv = document.getElementById('apptOverlay');
  if(existingOv) existingOv.parentNode.removeChild(existingOv);

  var editing = null;
  if(editId) {
    var found = (state.appointments || []).filter(function(a){ return a.id === editId; });
    editing = found.length ? found[0] : null;
  }

  var lang = state.lang;
  var L = {
    title:     {en:'Appointment', ar:'موعد', de:'Termin'},
    titleLbl:  {en:'Title', ar:'العنوان', de:'Titel'},
    dateLbl:   {en:'Date', ar:'التاريخ', de:'Datum'},
    timeLbl:   {en:'Time', ar:'الوقت', de:'Uhrzeit'},
    typeLbl:   {en:'Type', ar:'النوع', de:'Typ'},
    descLbl:   {en:'Description', ar:'الوصف', de:'Beschreibung'},
    reminderLbl: {en:'Reminder', ar:'التذكير', de:'Erinnerung'},
    save:      {en:'Save', ar:'حفظ', de:'Speichern'},
    cancel:    {en:'Cancel', ar:'إلغاء', de:'Abbrechen'},
    personal:  {en:'Personal', ar:'شخصي', de:'Persönlich'},
    business:  {en:'Business', ar:'عمل', de:'Business'},
    document:  {en:'Document', ar:'مستند', de:'Dokument'},
    vehicle:   {en:'Vehicle', ar:'مركبة', de:'Fahrzeug'},
    remNone:   {en:'No reminder', ar:'بدون تذكير', de:'Keine Erinnerung'},
    rem1d:     {en:'1 day before', ar:'قبل يوم واحد', de:'1 Tag vorher'},
    rem3d:     {en:'3 days before', ar:'قبل 3 أيام', de:'3 Tage vorher'},
    rem1w:     {en:'1 week before', ar:'قبل أسبوع', de:'1 Woche vorher'},
    rem2w:     {en:'2 weeks before', ar:'قبل أسبوعين', de:'2 Wochen vorher'},
  };
  function fx(k) { return (L[k] && L[k][lang]) || (L[k] && L[k].en) || k; }

  var ov = document.createElement('div');
  ov.id = 'apptOverlay';
  ov.className = 'modal-overlay open';

  var selType = editing ? editing.type : 'personal';
  var types = ['personal', 'business', 'document', 'vehicle'];

  var html = '';
  html += '<div class="modal" id="apptModal">';
  html += '<button class="modal-close-btn" id="apptCloseBtn">' + svgIcon('x', 16) + '</button>';
  html += '<div class="modal-handle"></div>';
  html += '<div class="modal-title">' + fx('title') + '</div>';
  html += '<input class="input-field" id="appt-title" placeholder="' + fx('titleLbl') + ' *" value="' + (editing ? escHtml(editing.title) : '') + '">';
  html += '<div style="display:flex;gap:10px;margin-bottom:12px">';
  html += '<div style="flex:1"><label style="font-size:12px;color:var(--text3);display:block;margin-bottom:4px">' + fx('dateLbl') + '</label><div class="date-fix-wrap" style="margin-bottom:0"><input type="date" class="input-field" id="appt-date" style="margin-bottom:0" value="' + (editing ? editing.date : (date || today())) + '"></div></div>';
  html += '<div style="flex:1"><label style="font-size:12px;color:var(--text3);display:block;margin-bottom:4px">' + fx('timeLbl') + '</label><div class="date-fix-wrap" style="margin-bottom:0"><input type="time" class="input-field" id="appt-time" style="margin-bottom:0" value="' + (editing ? (editing.time || '') : '') + '"></div></div>';
  html += '</div>';
  html += '<label style="font-size:12px;color:var(--text3);display:block;margin-bottom:6px">' + fx('typeLbl') + '</label>';
  html += '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-bottom:14px" id="appt-type-grid">';
  types.forEach(function(tpe) {
    var isSel = tpe === selType;
    html += '<button type="button" class="appt-type-btn" data-type="' + tpe + '" style="padding:10px 4px;border-radius:10px;border:2px solid ' + (isSel ? KAL_TYPE_COLORS[tpe] : 'var(--border)') + ';background:' + (isSel ? KAL_TYPE_COLORS[tpe] + '22' : 'none') + ';color:' + (isSel ? KAL_TYPE_COLORS[tpe] : 'var(--text2)') + ';cursor:pointer;font-size:11px;font-weight:600">' + fx(tpe) + '</button>';
  });
  html += '</div>';
  html += '<textarea class="input-field" id="appt-desc" rows="2" placeholder="' + fx('descLbl') + '" style="resize:none">' + (editing ? escHtml(editing.description || '') : '') + '</textarea>';
  html += '<label style="font-size:12px;color:var(--text3);display:block;margin:4px 0 6px">' + fx('reminderLbl') + '</label>';
  html += '<select class="input-field" id="appt-reminder">';
  var remOptions = [[0, 'remNone'], [1, 'rem1d'], [3, 'rem3d'], [7, 'rem1w'], [14, 'rem2w']];
  remOptions.forEach(function(opt) {
    var val = opt[0];
    var selAttr = editing ? (editing.reminderDays === val ? ' selected' : '') : (val === 0 ? ' selected' : '');
    html += '<option value="' + val + '"' + selAttr + '>' + fx(opt[1]) + '</option>';
  });
  html += '</select>';
  html += '<div style="display:flex;gap:10px;margin-top:16px">';
  html += '<button id="apptSaveBtn" style="flex:1;background:var(--primary);color:#fff;border:none;border-radius:12px;padding:13px;font-size:15px;font-weight:700;cursor:pointer">' + fx('save') + '</button>';
  html += '<button id="apptCancelBtn" style="flex:1;background:var(--bg);color:var(--text2);border:1.5px solid var(--border);border-radius:12px;padding:13px;font-size:15px;font-weight:600;cursor:pointer">' + fx('cancel') + '</button>';
  html += '</div>';
  html += '</div>';

  ov.innerHTML = html;
  document.body.appendChild(ov);

  window._apptEditId = editId || null;
  window._apptSelectedType = selType;

  var typeBtns = ov.querySelectorAll('.appt-type-btn');
  var ti;
  for(ti = 0; ti < typeBtns.length; ti++) {
    (function(btn) {
      btn.onclick = function() {
        window._apptSelectedType = btn.getAttribute('data-type');
        var tj;
        for(tj = 0; tj < typeBtns.length; tj++) {
          var t2 = typeBtns[tj].getAttribute('data-type');
          var isSel2 = t2 === window._apptSelectedType;
          typeBtns[tj].style.borderColor = isSel2 ? KAL_TYPE_COLORS[t2] : 'var(--border)';
          typeBtns[tj].style.background = isSel2 ? KAL_TYPE_COLORS[t2] + '22' : 'none';
          typeBtns[tj].style.color = isSel2 ? KAL_TYPE_COLORS[t2] : 'var(--text2)';
        }
      };
    })(typeBtns[ti]);
  }

  var closeBtn = document.getElementById('apptCloseBtn');
  if(closeBtn) closeBtn.onclick = closeAppointmentForm;
  var cancelBtn = document.getElementById('apptCancelBtn');
  if(cancelBtn) cancelBtn.onclick = closeAppointmentForm;
  var saveBtn = document.getElementById('apptSaveBtn');
  if(saveBtn) saveBtn.onclick = saveAppointment;
  ov.onclick = function(e) { if(e.target === ov) closeAppointmentForm(); };
}

function saveAppointment() {
  var titleEl = document.getElementById('appt-title');
  var title = titleEl ? titleEl.value.trim() : '';
  if(!title) { if(titleEl) titleEl.focus(); return; }
  var dateEl = document.getElementById('appt-date');
  var timeEl = document.getElementById('appt-time');
  var descEl = document.getElementById('appt-desc');
  var remEl = document.getElementById('appt-reminder');
  var dateVal = (dateEl && dateEl.value) ? dateEl.value : today();

  if(window._apptEditId) {
    var existing = null;
    var i;
    for(i = 0; i < state.appointments.length; i++) {
      if(state.appointments[i].id === window._apptEditId) { existing = state.appointments[i]; break; }
    }
    if(existing) {
      existing.title = title;
      existing.date = dateVal;
      existing.time = (timeEl && timeEl.value) || '';
      existing.type = window._apptSelectedType || 'personal';
      existing.description = (descEl && descEl.value) || '';
      existing.reminderDays = parseInt((remEl && remEl.value) || '0', 10) || 0;
    }
  } else {
    state.appointments.push({
      id: Date.now(),
      title: title,
      date: dateVal,
      time: (timeEl && timeEl.value) || '',
      type: window._apptSelectedType || 'personal',
      description: (descEl && descEl.value) || '',
      reminderDays: parseInt((remEl && remEl.value) || '0', 10) || 0,
      createdAt: new Date().toISOString(),
    });
  }
  save();
  closeAppointmentForm();
  _kalSelectedDate = dateVal;
  renderKalenderPage();
}

// ────────────────────────────────────────
// ── AGENDA: daily business activity log, linked to Kalender + Kontakte ──
// ────────────────────────────────────────
var AGENDA_L = {
  title:        {en:'Daily Log', ar:'سجل الأعمال اليومي', de:'Tagesprotokoll'},
  addEntry:     {en:'+ Add Entry', ar:'+ إضافة حركة', de:'+ Eintrag hinzufügen'},
  newEntry:     {en:'New Log Entry', ar:'حركة جديدة', de:'Neuer Eintrag'},
  editEntry:    {en:'Edit Log Entry', ar:'تعديل الحركة', de:'Eintrag bearbeiten'},
  titleLbl:     {en:'Title *', ar:'العنوان *', de:'Titel *'},
  dateLbl:      {en:'Date', ar:'التاريخ', de:'Datum'},
  contactLbl:   {en:'Related Contact (optional)', ar:'جهة الاتصال (اختياري)', de:'Zugehöriger Kontakt (optional)'},
  noContact:    {en:'None', ar:'بدون', de:'Keiner'},
  noteLbl:      {en:'Note', ar:'ملاحظة', de:'Notiz'},
  attachments:  {en:'Attachments', ar:'المرفقات', de:'Anhänge'},
  camera:       {en:'Camera', ar:'كاميرا', de:'Kamera'},
  upload:       {en:'Upload', ar:'رفع ملف', de:'Hochladen'},
  save:         {en:'Save', ar:'حفظ', de:'Speichern'},
  cancel:       {en:'Cancel', ar:'إلغاء', de:'Abbrechen'},
  edit:         {en:'Edit', ar:'تعديل', de:'Bearbeiten'},
  del:          {en:'Delete', ar:'حذف', de:'Löschen'},
  empty:        {en:'No log entries for this day', ar:'لا توجد حركات لهذا اليوم', de:'Keine Einträge für diesen Tag'},
  emptyAll:     {en:'No log entries yet', ar:'لا توجد حركات بعد', de:'Noch keine Einträge'},
  searchPh:     {en:'Search daily log...', ar:'بحث في سجل الأعمال...', de:'Tagesprotokoll durchsuchen...'},
  confirmDelete:{en:'Delete this log entry?', ar:'حذف هذه الحركة؟', de:'Diesen Eintrag löschen?'},
};
function agtx(k) { return (AGENDA_L[k] && AGENDA_L[k][state.lang]) || (AGENDA_L[k] && AGENDA_L[k].en) || k; }

function agendaDb() {
  return new Promise(function(resolve, reject) {
    if(window._agendaDbInst) { resolve(window._agendaDbInst); return; }
    var req = indexedDB.open('smartac_agendadocs', 1);
    req.onupgradeneeded = function(e) {
      var db = e.target.result;
      if(!db.objectStoreNames.contains('docs')) db.createObjectStore('docs', {keyPath:'id'});
    };
    req.onsuccess = function(e) { window._agendaDbInst = e.target.result; resolve(window._agendaDbInst); };
    req.onerror = function() { reject(req.error); };
  });
}
function agendaDocPut(rec) {
  return agendaDb().then(function(db) {
    return new Promise(function(res, rej) {
      var t = db.transaction('docs', 'readwrite');
      t.objectStore('docs').put(rec);
      t.oncomplete = res; t.onerror = function(){ rej(t.error); };
    });
  });
}
function agendaDocGet(id) {
  return agendaDb().then(function(db) {
    return new Promise(function(res, rej) {
      var r = db.transaction('docs').objectStore('docs').get(id);
      r.onsuccess = function(){ res(r.result); }; r.onerror = function(){ rej(r.error); };
    });
  });
}
function agendaDocDeleteRec(id) {
  return agendaDb().then(function(db) {
    return new Promise(function(res) {
      var t = db.transaction('docs', 'readwrite');
      t.objectStore('docs').delete(id);
      t.oncomplete = res; t.onerror = res;
    });
  }).catch(function(){});
}

function agendaSearchBlob(a) {
  var d = String(a.date || '').substring(0,10);
  var parts = d.split('-');
  var monthNames = KAL_MONTH_NAMES[state.lang] || KAL_MONTH_NAMES.en;
  var monthName = parts[1] ? (monthNames[parseInt(parts[1],10)-1] || '') : '';
  var contact = a.contactId ? (state.contacts || []).find(function(c){ return c.id === a.contactId; }) : null;
  return [a.title || '', a.note || '', d, formatDateDisplay(a.date), monthName, parts[0] || '', contact ? contact.name : ''].join(' ').toLowerCase();
}

// Shared list renderer used by both the Kalender day-detail section and the standalone Agenda page.
function renderAgendaEntriesHtml(list) {
  var isRTL = state.lang === 'ar';
  if(!list.length) {
    return '<div style="text-align:center;padding:20px;color:var(--text3);font-size:13px">' + agtx('empty') + '</div>';
  }
  var h = '';
  list.forEach(function(a) {
    var contact = a.contactId ? (state.contacts || []).find(function(c){ return c.id === a.contactId; }) : null;
    var docs = (state.agendaDocs || []).filter(function(d){ return d.agendaId === a.id; });
    var borderSide = isRTL ? 'border-right' : 'border-left';
    h += '<div style="background:var(--card);border-radius:12px;padding:12px 14px;margin-bottom:8px;' + borderSide + ':4px solid #8b5cf6;box-shadow:var(--shadow);text-align:' + (isRTL ? 'right' : 'left') + '">';
    h += '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px' + (isRTL ? ';flex-direction:row-reverse' : '') + '">';
    h += '<div style="flex:1;min-width:0">';
    h += '<div style="font-size:14px;font-weight:700">' + escHtml(a.title) + '</div>';
    if(a.date) h += '<div style="font-size:11px;color:var(--text3);margin-top:2px">' + formatDateDisplay(a.date) + '</div>';
    if(contact) h += '<div style="font-size:12px;color:#8b5cf6;margin-top:4px;font-weight:600">' + svgIcon('phone',11) + ' ' + escHtml(contact.name) + '</div>';
    if(a.note) h += '<div style="font-size:12px;color:var(--text2);margin-top:4px;white-space:pre-wrap">' + escHtml(a.note) + '</div>';
    if(docs.length) {
      h += '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">';
      docs.forEach(function(d) {
        var isPdf = d.type === 'application/pdf';
        h += '<span class="ag-doc-btn" data-id="' + d.id + '" style="display:inline-flex;align-items:center;gap:4px;background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:4px 8px;font-size:11px;color:var(--text2);cursor:pointer">' + svgIcon(isPdf ? 'fileText' : 'image', 12) + ' ' + escHtml(d.name) + '</span>';
      });
      h += '</div>';
    }
    h += '</div>';
    h += '<div style="display:flex;gap:6px;flex-shrink:0">';
    h += '<button class="ag-edit-btn" data-id="' + a.id + '" style="background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:5px 8px;font-size:11px;cursor:pointer;color:var(--text2)">' + agtx('edit') + '</button>';
    h += '<button class="ag-del-btn" data-id="' + a.id + '" style="background:rgba(239,68,68,0.1);border:none;border-radius:8px;padding:5px 8px;font-size:11px;cursor:pointer;color:#ef4444">' + agtx('del') + '</button>';
    h += '</div>';
    h += '</div></div>';
  });
  return h;
}

function wireAgendaEntriesButtons(container) {
  var editBtns = container.querySelectorAll('.ag-edit-btn');
  var i;
  for(i = 0; i < editBtns.length; i++) {
    (function(id) { editBtns[i].onclick = function(){ openAgendaForm(null, id); }; })(parseInt(editBtns[i].getAttribute('data-id'), 10));
  }
  var delBtns = container.querySelectorAll('.ag-del-btn');
  for(i = 0; i < delBtns.length; i++) {
    (function(id) { delBtns[i].onclick = function(){ deleteAgendaEntry(id); }; })(parseInt(delBtns[i].getAttribute('data-id'), 10));
  }
  var docBtns = container.querySelectorAll('.ag-doc-btn');
  for(i = 0; i < docBtns.length; i++) {
    (function(id) { docBtns[i].onclick = function(){ agendaDocView(id); }; })(parseInt(docBtns[i].getAttribute('data-id'), 10));
  }
}

function agendaDocView(docId) {
  agendaDocGet(docId).then(function(rec) { if(rec) openReceiptViewer(rec); });
}

var _agendaPendingFiles = [];

function renderAgendaPendingFilesHtml() {
  if(!_agendaPendingFiles.length) return '';
  var h = '<div style="display:flex;gap:6px;flex-wrap:wrap;margin:8px 0" id="agendaPendingList">';
  _agendaPendingFiles.forEach(function(f, idx) {
    h += '<span style="display:inline-flex;align-items:center;gap:4px;background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:4px 8px;font-size:11px;color:var(--text2)">' + svgIcon(f.type === 'application/pdf' ? 'fileText' : 'image', 12) + ' ' + escHtml(f.name) + ' <span class="ag-pending-remove" data-idx="' + idx + '" style="cursor:pointer;color:#ef4444;font-weight:700;margin-' + (state.lang==='ar'?'right':'left') + ':2px">×</span></span>';
  });
  h += '</div>';
  return h;
}

function agendaFileChosen(input) {
  var files = input.files;
  if(!files || !files.length) return;
  var arr = Array.prototype.slice.call(files);
  input.value = '';
  Promise.all(arr.map(function(f) {
    var isPdf = f.type === 'application/pdf';
    return receiptCompress(f).then(function(blob) {
      return {blob: blob, type: isPdf ? 'application/pdf' : 'image/jpeg', name: (f.name || 'file').replace(/\.[^.]+$/, '')};
    });
  })).then(function(results) {
    _agendaPendingFiles = _agendaPendingFiles.concat(results);
    var wrap = document.getElementById('agendaAttachWrap');
    if(wrap) { wrap.innerHTML = renderAgendaPendingFilesHtml() + renderAgendaExistingDocsHtml(window._agendaEditId); wireAgendaAttachWrap(); }
  });
}

function renderAgendaExistingDocsHtml(agendaId) {
  if(!agendaId) return '';
  var docs = (state.agendaDocs || []).filter(function(d){ return d.agendaId === agendaId; });
  if(!docs.length) return '';
  var h = '<div style="display:flex;gap:6px;flex-wrap:wrap;margin:8px 0" id="agendaExistingList">';
  docs.forEach(function(d) {
    h += '<span style="display:inline-flex;align-items:center;gap:4px;background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:4px 8px;font-size:11px;color:var(--text2)">' + svgIcon(d.type === 'application/pdf' ? 'fileText' : 'image', 12) + ' <span class="ag-existing-view" data-id="' + d.id + '" style="cursor:pointer">' + escHtml(d.name) + '</span> <span class="ag-existing-remove" data-id="' + d.id + '" style="cursor:pointer;color:#ef4444;font-weight:700;margin-' + (state.lang==='ar'?'right':'left') + ':2px">×</span></span>';
  });
  h += '</div>';
  return h;
}

function wireAgendaAttachWrap() {
  var wrap = document.getElementById('agendaAttachWrap');
  if(!wrap) return;
  var removeBtns = wrap.querySelectorAll('.ag-pending-remove');
  var i;
  for(i = 0; i < removeBtns.length; i++) {
    (function(idx) {
      removeBtns[i].onclick = function() {
        _agendaPendingFiles.splice(idx, 1);
        wrap.innerHTML = renderAgendaPendingFilesHtml() + renderAgendaExistingDocsHtml(window._agendaEditId);
        wireAgendaAttachWrap();
      };
    })(parseInt(removeBtns[i].getAttribute('data-idx'), 10));
  }
  var viewBtns = wrap.querySelectorAll('.ag-existing-view');
  for(i = 0; i < viewBtns.length; i++) {
    (function(id) { viewBtns[i].onclick = function(){ agendaDocView(id); }; })(parseInt(viewBtns[i].getAttribute('data-id'), 10));
  }
  var existingRemoveBtns = wrap.querySelectorAll('.ag-existing-remove');
  for(i = 0; i < existingRemoveBtns.length; i++) {
    (function(id) {
      existingRemoveBtns[i].onclick = function() {
        state.agendaDocs = (state.agendaDocs || []).filter(function(d){ return d.id !== id; });
        save();
        agendaDocDeleteRec(id);
        wrap.innerHTML = renderAgendaPendingFilesHtml() + renderAgendaExistingDocsHtml(window._agendaEditId);
        wireAgendaAttachWrap();
      };
    })(parseInt(existingRemoveBtns[i].getAttribute('data-id'), 10));
  }
}

function openAgendaForm(date, editId) {
  var existingOv = document.getElementById('agendaOverlay');
  if(existingOv) existingOv.parentNode.removeChild(existingOv);
  _agendaPendingFiles = [];

  var editing = null;
  if(editId) {
    var found = (state.agenda || []).filter(function(a){ return a.id === editId; });
    editing = found.length ? found[0] : null;
  }
  window._agendaEditId = editId || null;

  var ov = document.createElement('div');
  ov.id = 'agendaOverlay';
  ov.className = 'modal-overlay open';
  ov.style.zIndex = '100001'; // above appointment modal / kalender overlay layers

  var html = '';
  html += '<div class="modal" id="agendaModal">';
  html += '<button class="modal-close-btn" id="agendaCloseBtn">' + svgIcon('x', 16) + '</button>';
  html += '<div class="modal-handle"></div>';
  html += '<div class="modal-title">' + (editing ? agtx('editEntry') : agtx('newEntry')) + '</div>';
  html += '<input class="input-field" id="ag-title" placeholder="' + agtx('titleLbl') + '" value="' + (editing ? escHtml(editing.title) : '') + '">';
  html += '<label style="font-size:12px;color:var(--text3);display:block;margin-bottom:4px">' + agtx('dateLbl') + '</label>';
  html += '<div class="date-fix-wrap"><input type="date" class="input-field" id="ag-date" value="' + (editing ? editing.date : (date || today())) + '"></div>';
  html += '<label style="font-size:12px;color:var(--text3);display:block;margin-bottom:4px">' + agtx('contactLbl') + '</label>';
  html += '<select class="input-field" id="ag-contact">';
  html += '<option value="">' + agtx('noContact') + '</option>';
  (state.contacts || []).forEach(function(c) {
    var sel = editing && editing.contactId === c.id ? ' selected' : '';
    html += '<option value="' + c.id + '"' + sel + '>' + escHtml(c.name) + '</option>';
  });
  html += '</select>';
  html += '<textarea class="input-field" id="ag-note" rows="3" placeholder="' + agtx('noteLbl') + '" style="resize:vertical">' + (editing ? escHtml(editing.note || '') : '') + '</textarea>';
  html += '<label style="font-size:12px;color:var(--text3);display:block;margin:4px 0 6px">' + agtx('attachments') + '</label>';
  html += '<div style="display:flex;gap:8px;margin-bottom:8px">';
  html += '<button type="button" id="agendaCameraBtn" style="flex:1;padding:10px;border-radius:10px;border:1.5px dashed var(--border);background:var(--bg);color:var(--text2);font-size:13px;font-weight:600;cursor:pointer">' + svgIcon('camera',14) + ' ' + agtx('camera') + '</button>';
  html += '<button type="button" id="agendaUploadBtn" style="flex:1;padding:10px;border-radius:10px;border:1.5px dashed var(--border);background:var(--bg);color:var(--text2);font-size:13px;font-weight:600;cursor:pointer">' + svgIcon('upload',14) + ' ' + agtx('upload') + '</button>';
  html += '</div>';
  html += '<input type="file" id="agendaCameraInput" accept="image/*" capture="environment" style="display:none">';
  html += '<input type="file" id="agendaFileInput" accept="image/*,application/pdf" multiple style="display:none">';
  html += '<div id="agendaAttachWrap">' + renderAgendaPendingFilesHtml() + renderAgendaExistingDocsHtml(editId) + '</div>';
  html += '<div style="display:flex;gap:10px;margin-top:10px">';
  html += '<button id="agendaSaveBtn" style="flex:1;background:#8b5cf6;color:#fff;border:none;border-radius:12px;padding:13px;font-size:15px;font-weight:700;cursor:pointer">' + agtx('save') + '</button>';
  html += '<button id="agendaCancelBtn" style="flex:1;background:var(--bg);color:var(--text2);border:1.5px solid var(--border);border-radius:12px;padding:13px;font-size:15px;font-weight:600;cursor:pointer">' + agtx('cancel') + '</button>';
  html += '</div></div>';
  ov.innerHTML = html;
  document.body.appendChild(ov);

  function close() { _agendaPendingFiles = []; var o = document.getElementById('agendaOverlay'); if(o) o.parentNode.removeChild(o); }
  document.getElementById('agendaCloseBtn').onclick = close;
  document.getElementById('agendaCancelBtn').onclick = close;
  ov.onclick = function(e) { if(e.target === ov) close(); };
  document.getElementById('agendaCameraBtn').onclick = function() { document.getElementById('agendaCameraInput').click(); };
  document.getElementById('agendaUploadBtn').onclick = function() { document.getElementById('agendaFileInput').click(); };
  document.getElementById('agendaCameraInput').onchange = function() { agendaFileChosen(this); };
  document.getElementById('agendaFileInput').onchange = function() { agendaFileChosen(this); };
  document.getElementById('agendaSaveBtn').onclick = saveAgendaEntry;
  wireAgendaAttachWrap();
}

function saveAgendaEntry() {
  var titleEl = document.getElementById('ag-title');
  var title = titleEl ? titleEl.value.trim() : '';
  if(!title) { if(titleEl) titleEl.focus(); return; }
  var dateEl = document.getElementById('ag-date');
  var contactEl = document.getElementById('ag-contact');
  var noteEl = document.getElementById('ag-note');
  var dateVal = (dateEl && dateEl.value) ? dateEl.value : today();
  var contactId = (contactEl && contactEl.value) ? parseInt(contactEl.value, 10) : null;
  var note = (noteEl && noteEl.value) || '';

  var entryId;
  if(window._agendaEditId) {
    entryId = window._agendaEditId;
    var existing = (state.agenda || []).find(function(a){ return a.id === entryId; });
    if(existing) {
      existing.title = title; existing.date = dateVal; existing.contactId = contactId; existing.note = note;
    }
  } else {
    entryId = Date.now();
    state.agenda.push({id: entryId, title: title, date: dateVal, contactId: contactId, note: note, createdAt: Date.now()});
  }

  var pending = _agendaPendingFiles.slice();
  _agendaPendingFiles = [];
  Promise.all(pending.map(function(f, idx) {
    var docId = Date.now() + idx;
    return agendaDocPut({id: docId, user: localStorage.getItem('smartac_user') || '', name: f.name, type: f.type, blob: f.blob, createdAt: new Date().toISOString()})
      .then(function() { state.agendaDocs.push({id: docId, agendaId: entryId, name: f.name, type: f.type, createdAt: Date.now()}); });
  })).then(function() {
    save();
    var ov = document.getElementById('agendaOverlay');
    if(ov) ov.parentNode.removeChild(ov);
    _kalSelectedDate = dateVal;
    if(document.getElementById('kalenderPage') && document.getElementById('kalenderPage').style.display !== 'none') renderKalenderPage();
    if(document.getElementById('agendaPage') && document.getElementById('agendaPage').style.display !== 'none') renderAgendaPage();
  });
}

async function deleteAgendaEntry(id) {
  if(!(await confirmAsync(DELETE_CONFIRM_TITLE[state.lang]||DELETE_CONFIRM_TITLE.en, agtx('confirmDelete')))) return;
  var docs = (state.agendaDocs || []).filter(function(d){ return d.agendaId === id; });
  docs.forEach(function(d) { agendaDocDeleteRec(d.id); });
  state.agendaDocs = (state.agendaDocs || []).filter(function(d){ return d.agendaId !== id; });
  state.agenda = (state.agenda || []).filter(function(a){ return a.id !== id; });
  save();
  if(document.getElementById('kalenderPage') && document.getElementById('kalenderPage').style.display !== 'none') renderKalenderPage();
  if(document.getElementById('agendaPage') && document.getElementById('agendaPage').style.display !== 'none') renderAgendaPage();
}

function renderAgendaPage() {
  var page = document.getElementById('agendaPage');
  if(!page) return;
  var isRTL = state.lang === 'ar';
  var dir = isRTL ? 'rtl' : 'ltr';
  var h = '';
  h += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;direction:' + dir + '">';
  h += '<div style="display:flex;align-items:center;gap:8px">' + moreBackBtnHtml() + '<div style="font-size:20px;font-weight:700">' + agtx('title') + '</div></div>';
  h += '<button id="agendaPageAddBtn" style="background:#8b5cf6;color:#fff;border:none;border-radius:10px;padding:8px 14px;font-size:14px;font-weight:600;cursor:pointer">' + agtx('addEntry') + '</button>';
  h += '</div>';
  h += '<input type="text" id="agendaSearchInput" placeholder="' + agtx('searchPh') + '" oninput="filterAgenda(this.value)" style="width:100%;padding:12px 16px;border-radius:14px;border:1.5px solid var(--border);background:var(--card);color:var(--text);font-size:14px;box-sizing:border-box;outline:none;margin-bottom:14px;direction:' + dir + '">';
  h += '<div id="agendaPageList" style="direction:' + dir + '"></div>';
  page.innerHTML = h;

  renderAgendaPageList(state.agenda || []);
  var addBtn = document.getElementById('agendaPageAddBtn');
  if(addBtn) addBtn.onclick = function(){ openAgendaForm(today()); };
}

function renderAgendaPageList(list) {
  var wrap = document.getElementById('agendaPageList');
  if(!wrap) return;
  var sorted = list.slice().sort(function(a, b){ return (b.date||'').localeCompare(a.date||'') || (b.createdAt||0) - (a.createdAt||0); });
  wrap.innerHTML = sorted.length ? renderAgendaEntriesHtml(sorted) : '<div style="text-align:center;padding:40px 16px;color:var(--text3)">' + agtx('emptyAll') + '</div>';
  wireAgendaEntriesButtons(wrap);
}

function filterAgenda(query) {
  var q = (query || '').trim().toLowerCase();
  var list = !q ? (state.agenda || []) : (state.agenda || []).filter(function(a) { return agendaSearchBlob(a).indexOf(q) !== -1; });
  renderAgendaPageList(list);
}

// ── NOTIZEN ──
var NOTIZ_L = {
  title:    {en:'Notes', ar:'الملاحظات', de:'Notizen'},
  newNote:  {en:'+ New Note', ar:'+ ملاحظة جديدة', de:'+ Neue Notiz'},
  empty:    {en:'No notes yet', ar:'لا ملاحظات', de:'Keine Notizen'},
  confirmDelete: {en:'Delete this note?', ar:'حذف هذه الملاحظة؟', de:'Diese Notiz löschen?'},
};
function nztx(k) { return (NOTIZ_L[k] && NOTIZ_L[k][state.lang]) || (NOTIZ_L[k] && NOTIZ_L[k].en) || k; }

function formatNoteDate(iso) {
  if(!iso) return '';
  var d = new Date(iso);
  if(isNaN(d.getTime())) return '';
  return formatDateDisplay(d.toISOString().substring(0, 10));
}

async function deleteNote(id) {
  if(!(await confirmAsync(DELETE_CONFIRM_TITLE[state.lang]||DELETE_CONFIRM_TITLE.en, nztx('confirmDelete')))) return;
  state.notes = state.notes.filter(function(n){ return n.id !== id; });
  save();
  renderNotizenPage();
}

function renderNotizenPage() {
  var page = document.getElementById('notizenPage');
  if(!page) return;

  var h = '';
  h += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">';
  h += '<div style="display:flex;align-items:center;gap:8px">' + moreBackBtnHtml() + '<div style="font-size:18px;font-weight:700">' + nztx('title') + '</div></div>';
  h += '<button id="notizAddBtn" style="background:#0061a4;color:#fff;border:none;border-radius:10px;padding:8px 14px;font-size:13px;font-weight:600;cursor:pointer">' + nztx('newNote') + '</button>';
  h += '</div>';

  var notes = (state.notes || []).slice().sort(function(a, b) {
    return new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0);
  });

  if(!notes.length) {
    h += '<div style="text-align:center;padding:60px 20px;color:var(--text3);font-size:14px">' + nztx('empty') + '</div>';
  } else {
    h += '<div class="notiz-grid" style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px">';
    notes.forEach(function(n) {
      var preview = (n.content || '').substring(0, 80);
      var dateStr = formatNoteDate(n.updatedAt || n.createdAt);
      h += '<div class="notiz-card" data-id="' + n.id + '" style="background:var(--card);border-radius:16px;padding:16px;cursor:pointer;box-shadow:0 1px 4px rgba(0,0,0,0.06);position:relative">';
      h += '<button class="notiz-del-btn" data-id="' + n.id + '" style="position:absolute;top:8px;right:8px;background:none;border:none;color:var(--text3);cursor:pointer;padding:4px;border-radius:6px">' + svgIcon('x', 14) + '</button>';
      h += '<div style="font-size:14px;font-weight:700;margin-bottom:4px;padding-right:16px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + escHtml(n.title || '') + '</div>';
      h += '<div style="font-size:12px;color:var(--text3);margin-bottom:8px;overflow:hidden;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical">' + escHtml(preview) + '</div>';
      if(n.images && n.images.length) {
        h += '<div style="display:flex;gap:4px;margin-bottom:6px;overflow:hidden">';
        n.images.slice(0, 3).forEach(function(img) {
          h += '<img src="' + img + '" style="width:28px;height:28px;border-radius:6px;object-fit:cover;flex-shrink:0">';
        });
        h += '</div>';
      }
      var badges = '';
      if(n.pdfs && n.pdfs.length) badges += '<span style="font-size:10px;color:var(--text3);display:inline-flex;align-items:center;gap:2px;margin-right:8px">' + svgIcon('paperclip', 10) + n.pdfs.length + '</span>';
      if(n.links && n.links.length) badges += '<span style="font-size:10px;color:var(--text3);display:inline-flex;align-items:center;gap:2px">' + svgIcon('link', 10) + n.links.length + '</span>';
      if(badges) h += '<div style="margin-bottom:4px">' + badges + '</div>';
      h += '<div style="font-size:11px;color:var(--text3)">' + dateStr + '</div>';
      h += '</div>';
    });
    h += '</div>';
  }

  page.innerHTML = h;

  var addBtn = document.getElementById('notizAddBtn');
  if(addBtn) addBtn.onclick = function(){ openNoteEditor(null); };

  var cards = page.querySelectorAll('.notiz-card');
  var ci;
  for(ci = 0; ci < cards.length; ci++) {
    (function(card) {
      var id = parseInt(card.getAttribute('data-id'), 10);
      card.onclick = function() { openNoteEditor(id); };
    })(cards[ci]);
  }

  var delBtns = page.querySelectorAll('.notiz-del-btn');
  var di;
  for(di = 0; di < delBtns.length; di++) {
    (function(btn) {
      var id = parseInt(btn.getAttribute('data-id'), 10);
      btn.onclick = function(e) { e.stopPropagation(); deleteNote(id); };
    })(delBtns[di]);
  }
}

// ── NOTE EDITOR ──
var _noteEditorId = null;
var _noteEditorImages = [];
var _noteEditorPdfs = [];
var _noteEditorLinks = [];

var NOTE_ED_L = {
  back:        {en:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px"><polyline points="15 18 9 12 15 6"/></svg> Back', ar:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px"><polyline points="9 18 15 12 9 6"/></svg> رجوع', de:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px"><polyline points="15 18 9 12 15 6"/></svg> Zurück'},
  save:        {en:'Save', ar:'حفظ', de:'Speichern'},
  titlePh:     {en:'Title...', ar:'العنوان...', de:'Titel...'},
  contentPh:   {en:'Write a note...', ar:'اكتب ملاحظة...', de:'Notiz schreiben...'},
  linkLabelPh: {en:'Label', ar:'التسمية', de:'Bezeichnung'},
  linkUrlPh:   {en:'URL', ar:'الرابط', de:'URL'},
  add:         {en:'Add', ar:'إضافة', de:'Hinzufügen'},
  cancel:      {en:'Cancel', ar:'إلغاء', de:'Abbrechen'},
};
function nedtx(k) { return (NOTE_ED_L[k] && NOTE_ED_L[k][state.lang]) || (NOTE_ED_L[k] && NOTE_ED_L[k].en) || k; }

function closeNoteEditor() {
  var ov = document.getElementById('noteEditorOverlay');
  if(ov) ov.parentNode.removeChild(ov);
}

function removeNoteImage(idx) {
  _noteEditorImages.splice(idx, 1);
  renderNoteAttachments();
}
function removeNotePdf(idx) {
  _noteEditorPdfs.splice(idx, 1);
  renderNoteAttachments();
}
function removeNoteLink(idx) {
  _noteEditorLinks.splice(idx, 1);
  renderNoteAttachments();
}

function renderNoteAttachments() {
  var wrap = document.getElementById('note-attachments');
  if(!wrap) return;
  var h = '';
  if(_noteEditorImages.length) {
    h += '<div style="display:flex;gap:8px;overflow-x:auto;padding-bottom:6px;margin-bottom:8px">';
    _noteEditorImages.forEach(function(img, idx) {
      h += '<div style="position:relative;flex-shrink:0">';
      h += '<img class="note-img-thumb" data-idx="' + idx + '" src="' + img + '" style="width:60px;height:60px;border-radius:8px;object-fit:cover;cursor:pointer">';
      h += '<button class="note-img-remove" data-idx="' + idx + '" style="position:absolute;top:-6px;right:-6px;background:#ef4444;color:#fff;border:none;border-radius:50%;width:18px;height:18px;font-size:11px;cursor:pointer;line-height:18px;padding:0">×</button>';
      h += '</div>';
    });
    h += '</div>';
  }
  if(_noteEditorPdfs.length) {
    h += '<div style="display:flex;flex-direction:column;gap:6px;margin-bottom:8px">';
    _noteEditorPdfs.forEach(function(pdf, idx) {
      h += '<div style="display:flex;align-items:center;gap:8px;background:var(--card);border-radius:10px;padding:8px 10px">';
      h += '<span class="note-pdf-chip" data-idx="' + idx + '" style="flex:1;display:flex;align-items:center;gap:6px;cursor:pointer;overflow:hidden;font-size:12px;color:var(--text)">' + svgIcon('paperclip', 14) + '<span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + escHtml(pdf.name) + '</span></span>';
      h += '<button class="note-pdf-remove" data-idx="' + idx + '" style="background:none;border:none;color:#ef4444;cursor:pointer;font-size:14px;padding:2px">×</button>';
      h += '</div>';
    });
    h += '</div>';
  }
  if(_noteEditorLinks.length) {
    h += '<div style="display:flex;flex-direction:column;gap:6px">';
    _noteEditorLinks.forEach(function(link, idx) {
      h += '<div style="display:flex;align-items:center;gap:8px;background:var(--card);border-radius:10px;padding:8px 10px">';
      h += '<span class="note-link-chip" data-idx="' + idx + '" style="flex:1;display:flex;align-items:center;gap:6px;cursor:pointer;overflow:hidden;font-size:12px;color:var(--primary)">' + svgIcon('link', 14) + '<span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + escHtml(link.label) + '</span></span>';
      h += '<button class="note-link-remove" data-idx="' + idx + '" style="background:none;border:none;color:#ef4444;cursor:pointer;font-size:14px;padding:2px">×</button>';
      h += '</div>';
    });
    h += '</div>';
  }
  wrap.innerHTML = h;

  var thumbs = wrap.querySelectorAll('.note-img-thumb');
  var ti;
  for(ti = 0; ti < thumbs.length; ti++) {
    (function(el) {
      var idx = parseInt(el.getAttribute('data-idx'), 10);
      el.onclick = function() { openInvoice(_noteEditorImages[idx], 'image'); };
    })(thumbs[ti]);
  }
  var imgRemoves = wrap.querySelectorAll('.note-img-remove');
  var iri;
  for(iri = 0; iri < imgRemoves.length; iri++) {
    (function(el) {
      var idx = parseInt(el.getAttribute('data-idx'), 10);
      el.onclick = function() { removeNoteImage(idx); };
    })(imgRemoves[iri]);
  }
  var pdfChips = wrap.querySelectorAll('.note-pdf-chip');
  var pci;
  for(pci = 0; pci < pdfChips.length; pci++) {
    (function(el) {
      var idx = parseInt(el.getAttribute('data-idx'), 10);
      el.onclick = function() { openInvoice(_noteEditorPdfs[idx].data, _noteEditorPdfs[idx].name); };
    })(pdfChips[pci]);
  }
  var pdfRemoves = wrap.querySelectorAll('.note-pdf-remove');
  var pri;
  for(pri = 0; pri < pdfRemoves.length; pri++) {
    (function(el) {
      var idx = parseInt(el.getAttribute('data-idx'), 10);
      el.onclick = function() { removeNotePdf(idx); };
    })(pdfRemoves[pri]);
  }
  var linkChips = wrap.querySelectorAll('.note-link-chip');
  var lci;
  for(lci = 0; lci < linkChips.length; lci++) {
    (function(el) {
      var idx = parseInt(el.getAttribute('data-idx'), 10);
      el.onclick = function() { window.open(_noteEditorLinks[idx].url, '_blank'); };
    })(linkChips[lci]);
  }
  var linkRemoves = wrap.querySelectorAll('.note-link-remove');
  var lri;
  for(lri = 0; lri < linkRemoves.length; lri++) {
    (function(el) {
      var idx = parseInt(el.getAttribute('data-idx'), 10);
      el.onclick = function() { removeNoteLink(idx); };
    })(linkRemoves[lri]);
  }
}

function openNoteEditor(noteId) {
  var existingOv = document.getElementById('noteEditorOverlay');
  if(existingOv) existingOv.parentNode.removeChild(existingOv);

  var editing = null;
  if(noteId) {
    var found = (state.notes || []).filter(function(n){ return n.id === noteId; });
    editing = found.length ? found[0] : null;
  }

  _noteEditorId = editing ? editing.id : null;
  _noteEditorImages = (editing && editing.images) ? editing.images.slice() : [];
  _noteEditorPdfs = (editing && editing.pdfs) ? editing.pdfs.slice() : [];
  _noteEditorLinks = (editing && editing.links) ? editing.links.slice() : [];

  var ov = document.createElement('div');
  ov.id = 'noteEditorOverlay';
  ov.style.cssText = 'position:fixed;inset:0;z-index:9999;background:var(--bg);display:flex;flex-direction:column';

  var html = '';
  html += '<div style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-bottom:1px solid var(--border);flex-shrink:0">';
  html += '<button id="noteBackBtn" style="background:none;border:none;color:var(--text);font-size:15px;cursor:pointer;padding:6px 4px">' + nedtx('back') + '</button>';
  html += '<button id="noteSaveBtn" style="background:none;border:none;color:var(--primary);font-size:15px;font-weight:700;cursor:pointer;padding:6px 4px">' + nedtx('save') + '</button>';
  html += '</div>';

  html += '<div style="flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column">';
  html += '<input id="note-title" placeholder="' + nedtx('titlePh') + '" style="font-size:20px;font-weight:700;border:none;outline:none;background:none;color:var(--text);padding:6px 0;border-bottom:2px solid transparent;margin-bottom:10px" value="' + (editing ? escHtml(editing.title || '') : '') + '">';
  html += '<textarea id="note-content" placeholder="' + nedtx('contentPh') + '" style="flex:1;min-height:160px;resize:none;border:none;outline:none;background:none;color:var(--text);font-size:15px;line-height:1.7;font-family:inherit">' + (editing ? escHtml(editing.content || '') : '') + '</textarea>';
  html += '<div id="note-attachments" style="margin-top:12px"></div>';
  html += '</div>';

  html += '<div id="note-link-input-row" style="display:none;padding:10px 16px;border-top:1px solid var(--border);gap:8px;flex-direction:column">';
  html += '<input id="note-link-label" placeholder="' + nedtx('linkLabelPh') + '" style="padding:9px 12px;border-radius:10px;border:1.5px solid var(--border);background:var(--bg);color:var(--text);font-size:13px;box-sizing:border-box">';
  html += '<input id="note-link-url" placeholder="' + nedtx('linkUrlPh') + '" type="url" style="padding:9px 12px;border-radius:10px;border:1.5px solid var(--border);background:var(--bg);color:var(--text);font-size:13px;box-sizing:border-box">';
  html += '<div style="display:flex;gap:8px">';
  html += '<button id="noteLinkAddBtn" style="flex:1;background:var(--primary);color:#fff;border:none;border-radius:10px;padding:9px;font-size:13px;font-weight:600;cursor:pointer">' + nedtx('add') + '</button>';
  html += '<button id="noteLinkCancelBtn" style="flex:1;background:var(--card);color:var(--text2);border:1.5px solid var(--border);border-radius:10px;padding:9px;font-size:13px;cursor:pointer">' + nedtx('cancel') + '</button>';
  html += '</div>';
  html += '</div>';

  html += '<div style="display:flex;gap:10px;padding:12px 16px;border-top:1px solid var(--border);flex-shrink:0">';
  html += '<button id="noteImgBtn" style="background:var(--card);border:1px solid var(--border);border-radius:10px;width:44px;height:44px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--text2)">' + svgIcon('camera', 18) + '</button>';
  html += '<button id="notePdfBtn" style="background:var(--card);border:1px solid var(--border);border-radius:10px;width:44px;height:44px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--text2)">' + svgIcon('paperclip', 18) + '</button>';
  html += '<button id="noteLinkBtn" style="background:var(--card);border:1px solid var(--border);border-radius:10px;width:44px;height:44px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--text2)">' + svgIcon('link', 18) + '</button>';
  html += '</div>';

  html += '<input type="file" id="noteImgInput" accept="image/*" style="display:none">';
  html += '<input type="file" id="notePdfInput" accept=".pdf,application/pdf" style="display:none">';

  ov.innerHTML = html;
  document.body.appendChild(ov);

  renderNoteAttachments();

  var backBtn = document.getElementById('noteBackBtn');
  if(backBtn) backBtn.onclick = closeNoteEditor;
  var saveBtn = document.getElementById('noteSaveBtn');
  if(saveBtn) saveBtn.onclick = saveNote;

  var titleEl = document.getElementById('note-title');
  if(titleEl) {
    titleEl.onfocus = function(){ titleEl.style.borderBottomColor = 'var(--primary)'; };
    titleEl.onblur = function(){ titleEl.style.borderBottomColor = 'transparent'; };
  }

  var imgBtn = document.getElementById('noteImgBtn');
  var imgInput = document.getElementById('noteImgInput');
  if(imgBtn && imgInput) {
    imgBtn.onclick = function(){ imgInput.click(); };
    imgInput.onchange = function(){
      var file = imgInput.files[0];
      if(!file) return;
      if(file.type.indexOf('image/') !== 0) { imgInput.value = ''; return; }
      var reader = new FileReader();
      reader.onload = function(e) {
        _noteEditorImages.push(e.target.result);
        renderNoteAttachments();
      };
      reader.readAsDataURL(file);
      imgInput.value = '';
    };
  }

  var pdfBtn = document.getElementById('notePdfBtn');
  var pdfInput = document.getElementById('notePdfInput');
  if(pdfBtn && pdfInput) {
    pdfBtn.onclick = function(){ pdfInput.click(); };
    pdfInput.onchange = function(){
      var file = pdfInput.files[0];
      if(!file) return;
      var isPdf = file.type === 'application/pdf' || /\.pdf$/i.test(file.name || '');
      if(!isPdf) { pdfInput.value = ''; return; }
      var reader = new FileReader();
      reader.onload = function(e) {
        _noteEditorPdfs.push({name: file.name, data: e.target.result});
        renderNoteAttachments();
      };
      reader.readAsDataURL(file);
      pdfInput.value = '';
    };
  }

  var linkBtn = document.getElementById('noteLinkBtn');
  var linkRow = document.getElementById('note-link-input-row');
  if(linkBtn && linkRow) {
    linkBtn.onclick = function(){ linkRow.style.display = linkRow.style.display === 'none' ? 'flex' : 'none'; };
  }
  var linkCancelBtn = document.getElementById('noteLinkCancelBtn');
  if(linkCancelBtn) linkCancelBtn.onclick = function(){
    linkRow.style.display = 'none';
    document.getElementById('note-link-label').value = '';
    document.getElementById('note-link-url').value = '';
  };
  var linkAddBtn = document.getElementById('noteLinkAddBtn');
  if(linkAddBtn) linkAddBtn.onclick = function(){
    var labelEl = document.getElementById('note-link-label');
    var urlEl = document.getElementById('note-link-url');
    var url = urlEl.value.trim();
    if(!url) { urlEl.focus(); return; }
    if(!/^https?:\/\//i.test(url)) url = 'https://' + url;
    var label = labelEl.value.trim() || url;
    _noteEditorLinks.push({label: label, url: url});
    labelEl.value = '';
    urlEl.value = '';
    linkRow.style.display = 'none';
    renderNoteAttachments();
  };
}

function saveNote() {
  var titleEl = document.getElementById('note-title');
  var contentEl = document.getElementById('note-content');
  var title = titleEl ? titleEl.value.trim() : '';
  var content = contentEl ? contentEl.value : '';
  if(!title && !content && !_noteEditorImages.length && !_noteEditorPdfs.length && !_noteEditorLinks.length) {
    closeNoteEditor();
    return;
  }
  var nowIso = new Date().toISOString();
  if(_noteEditorId) {
    var existing = null;
    var i;
    for(i = 0; i < state.notes.length; i++) {
      if(state.notes[i].id === _noteEditorId) { existing = state.notes[i]; break; }
    }
    if(existing) {
      existing.title = title;
      existing.content = content;
      existing.images = _noteEditorImages.slice();
      existing.pdfs = _noteEditorPdfs.slice();
      existing.links = _noteEditorLinks.slice();
      existing.updatedAt = nowIso;
    }
  } else {
    state.notes.push({
      id: Date.now(),
      title: title,
      content: content,
      images: _noteEditorImages.slice(),
      pdfs: _noteEditorPdfs.slice(),
      links: _noteEditorLinks.slice(),
      createdAt: nowIso,
      updatedAt: nowIso,
    });
  }
  save();
  closeNoteEditor();
  renderNotizenPage();
}

# Smartac — Project Roadmap (TODO)

> الحالة: `[x]` = خلص ✅ | `[~]` = جاري / ناقص ⚠️ | `[ ]` = لسه مبدأش ❌

---

## المرحلة 1 — v1.0 (مكتملة ✅)

- [x] تذكير مواعيد الفواتير المستحقة
- [x] WhatsApp share للفواتير (بدل PDF Save)
- [x] Search في المعاملات
- [x] اختبار شامل على موبايل (iOS Safari)
- [x] اختبار شامل على ديسكتوب (Chrome/Firefox)
- [x] رفع v1.0 على Netlify كـ stable version
- [x] commit على GitHub بـ tag "v1.0"

---

## المرحلة 1.5 — Transport Module + Industry Profiles + VAT (جارية 🚧)

> الترتيب الحالي جوا المرحلة: UI → أشكال الفواتير → Industry Profiles → Kalender/Notizen → VAT (جاري) → Mitarbeiter (جزء 1 خلص، جاري) → Fleet → Assets

### أ) Industry Profiles (الأساس)

- [x] إضافة Business Type selector في الـ Onboarding
- [x] عرض Business Type في Settings (read-only)
- [x] حفظ `state.businessType` في localStorage
- [x] إظهار/إخفاء Fleet في التاب حسب businessType

### ب) VAT System (Brutto/Netto/Steuer)

- [x] إضافة VAT rate field لكل معاملة (0%, 10%, 13%, 20%)
- [x] حساب Brutto/Netto/Steuer أوتوماتيكيًا لكل معاملة (+ معاينة لحظية في المودال + تفاصيل المعاملة)
- [x] عرض Net Income (Income − Expenses − Zahllast) في الـ Home
- [x] تقرير UVA جاهز للمحاسب (PDF/Excel بالألماني، بأرقام الخانات الرسمية KZ 000/022/006/029/060/095)
- [x] نظام Freigabe: اعتماد الفترة (شهري/ربع سنوي/سنوي) + قفل التعديل بعد الاعتماد + ختم "Freigegeben" على التصدير

### ج) UI & UX (مطلوب من الـ pilot)

- ~~تغيير الخلفية/watermark في الصفحات~~ (اتلغت — القرار إن الـ watermark تفضل محذوفة)
- [x] تحسين السلاسة وحركة الـ Modal (قفل تمرير الخلفية على الموبايل + السحب لتحت للإغلاق)
- [x] حركة أنيميشن لعناصر الصفحة الرئيسية عند التحميل (staggered fade-up)
- [x] أشكال متعددة للفواتير (Classic, Modern, Minimal, Transport)
- [x] إعادة تصميم EPC QR Code للدفع البنكي في الفواتير
- [x] Dashboard (Income/Expenses/Overdue/Debts/Net Income)
- [x] إعادة تصميم Bottom Nav + More Menu + Sidebar
- [x] صفحة Help
- [x] إصلاح RTL الكامل للعربي (اتجاه، أسهم، أرقام LTR)

### د) Mitarbeiter (الموظفين الموسع)

- [x] نقل الموظفين من صفحة Fixed لصفحة مستقلة + بروفايل كامل لكل موظف (بيانات شخصية + ملاحظات) — Part 1
- [x] رفع ملفات PDF وصور لكل موظف مع تسمية كل ملف — Part 2 (تخزين محلي IndexedDB، نفس نظام فواتير المصاريف)
- [x] تنبيهات انتهاء الوثائق — Part 2 (أي مستند بتاريخ انتهاء بيظهر في Kalender وبيبعت تنبيه قبل 30 يوم؛ badge أحمر لو منتهي وبرتقالي لو قرب)
- [x] تسجيل ساعات العمل (Arbeitszeiterfassung) — Part 3 (تسجيل يدوي: تاريخ/بداية/نهاية/استراحة/ملاحظة، حساب الساعات تلقائي مع دعم الشِفت الليلي، وملخص إجمالي الشهر)
- [x] التأكد إن حساب الرواتب الشهري التلقائي لسه شغال — لقينا وصلحنا bug: كان بيسجل بس لو المستخدم فاضل مسجل دخول من قبل (auto-login)، مش لو دخل يوزر وباسورد يدوي. اتصلح ودلوقتي بيشتغل في الحالتين

### هـ) Fleet / Fahrzeuge

- [x] صفحة جديدة "Fleet" في التاب (تظهر لأصحاب businessType = transport بس)
- [x] بروفايل لكل سيارة (رقم اللوحة، الاسم/التسمية، النوع، سنة الصنع، ملاحظات)
- [x] رفع ملفات PDF وصور لكل سيارة مع تسمية كل ملف (تخزين محلي IndexedDB، نفس نظام مستندات الموظفين)
- [x] تسجيل الصيانات والمصاريف لكل سيارة (تاريخ، فئة، وصف، تكلفة، إجمالي تلقائي) — سجل توثيقي منفصل عن المعاملات المالية، مش بيتحسب تلقائيًا في الدخل/المصروفات أو UVA
- [x] تنبيهات (Pickerl، TÜV، تأمين، إلخ) — أي مستند بتاريخ انتهاء بيظهر في Kalender وبيبعت تنبيه قبل 30 يوم، زي نظام مستندات الموظفين بالظبط

### و) Kalender & Notizen

- [x] صفحة Kalender مع إضافة موعد
- [x] عرض المواعيد والتنبيهات مع Alarm (reminder)
- [x] صفحة Notizen (ملاحظات حرة: نص + صور + PDF + تكات)
- [~] تنبيهات تلقائية من Mitarbeiter والـ Fleet في Kalender

### ز) Anlagevermögen (أصول الشركة)

- [x] صفحة جديدة "Assets" (بتظهر لكل أنواع النشاط، مش بس Transport)
- [x] إضافة أصل (اسم، قيمة، تاريخ الشراء) — أصول عامة (معدات، أثاث...) + العربيات بتظهر تلقائيًا من Fleet من غير تكرار إدخال
- [x] إدخال معدل الإهلاك السنوي (%) لكل أصل — مقترح افتراضي 12.5% (8 سنين) للعربيات، قابل للتعديل من المحاسب
- [x] حساب تلقائي للإهلاك الشهري والقيمة الدفترية الحالية — تقرير بس حاليًا، لسه مش بيتخصم من صافي الدخل في الرئيسية (قرار مؤجل لحد رأي البايلوت)
- [x] تقرير الأصول الكامل (تصدير PDF بالعربيات والأصول العامة + الإجمالي)

### ح) OCR للمصاريف

- [x] فتح الكاميرا وتصوير الفاتورة الورقية (+ رفع صورة/PDF) وإرفاقها بالمصروف — تخزين محلي في IndexedDB
- [x] استخراج Brutto/Netto/MwSt تلقائيًا كاقتراح — OCR محلي (Tesseract.js) والمستخدم يراجع ويأكد
- [ ] استخراج بدقة عالية بالـ AI (Claude API) — Pro feature في v2.0 مع الـ Backend
- [ ] تخزين الصور مجمعة كـ PDF في مجموعات (v2.0)

### ط) إصلاحات وتحسينات جانبية (تمت أثناء بناء المرحلة 1.5 ✅)

- [x] إصلاح bug عزل بيانات المستخدمين (كل يوزر يشوف بياناته بس)
- [x] Notification Center + Toast notifications
- [x] رفع فواتير PDF / تعديل شكل فورم التسجيل
- [x] استبدال كل الإيموجيز في الـ UI بأيقونات SVG احترافية (اللوجو، password strength)
- [x] ربط الموردين/العملاء بجهات الاتصال والديون مع خيار "Other" (Customer/Supplier + Friend/Partner)
- [x] رفع اللوجو الخاص بنا في الفواتير والداشبورد
- [x] Excel Export احترافي (4 sheets: Summary, Transactions, Clients, Suppliers)
- [x] نقل الريبو لـ GitHub Organization (SmartOrdi-OG)

### إضافة المرحلة 1.5 — Retail Module

**Inventory / المخزون (Retail فقط)**

- [x] صفحة جديدة "Inventory" في التاب (بتظهر لأصحاب businessType = retail بس)
- [x] إضافة منتج (اسم، وصف، سعر شراء، سعر بيع، كمية، وحدة القياس)
- [x] تنبيه نفاد المخزون (لما الكمية تقل عن حد معين — قابل للتخصيص لكل منتج، تنبيه فوري + تنبيه يومي لو لسه ناقصة)
- [x] تحديث الكمية عند كل عملية بيع أو شراء — خانة "منتج (اختياري) + كمية" في مودال إضافة الدخل/المصروف؛ الدخل بيخصم من المخزون والمصروف بيضيف عليه
- [x] تقرير المخزون (المنتجات، الكميات، القيمة الإجمالية) — تصدير PDF
- [ ] Barcode scanner (اختياري — v2.0)

**Coming Soon للأنواع التانية (v2.0)**

- [ ] Restaurant / Café → Menu + Tables
- [ ] Construction → Projects + Materials
- [ ] Medical / Clinic → Patients + Appointments

---

### ي) واجهة المحاسب (buchhalter.html) — حل مؤقت محلي قبل الـ Cloud

**ملاحظة:** ده حل مؤقت لحد ما نوصل للمرحلة 2 (Supabase) — شغال بس من نفس المتصفح/الجهاز بتاع صاحب البيزنس (localStorage مش مشترك بين الأجهزة). الـ "Multi-account Viewer" الحقيقي (دخول من أي مكان) موجود تحت في المرحلة 3.

- [x] ملف منفصل `buchhalter.html` — قراءة فقط بالكامل، بدون أي دالة `save()`
- [x] تسجيل دخول بيوزر/باسورد تجريبيين مختلفين عن حسابات المستخدمين (`buchhalter` / `Steuer2026!`)
- [x] لينك "Als Buchhalter anmelden" في صفحة اللوج ان الرئيسية
- [x] اختيار الحساب (قائمة كل حسابات البيزنس المحفوظة في نفس المتصفح)
- [x] تابات: نظرة عامة، UVA، المعاملات، الفواتير، الموظفين، الأصول، تنزيلات — بالألماني بالكامل
- [x] تنزيل UVA كـ PDF، المعاملات كـ CSV، الأصول (Anlagevermögen) كـ PDF، المخزون كـ PDF (للـ retail بس)
- [x] حماية من تعارض IndexedDB مع التطبيق الأساسي (فحص وجود الداتابيز قبل الفتح)

---

## Push Notifications (بعد التحويل للـ Cloud/Backend)

- [ ] Service Worker setup للـ PWA
- [ ] طلب إذن الـ notifications من المستخدم
- [ ] Push notifications للمواعيد والتنبيهات
- [ ] Push notifications لانتهاء وثائق الموظفين
- [ ] Push notifications لمواعيد الـ Fleet (Pickerl, TÜV)
- [ ] Push notifications للفواتير المتأخرة
- [ ] دعم iOS (PWA Add to Home Screen — من iOS 16.4+)
- [ ] دعم Android Chrome كامل

---

## المرحلة 2 — Supabase Setup

- [ ] إنشاء project على supabase.com
- [ ] إنشاء الـ tables: users, transactions, clients, suppliers, invoices, recurring, employees, fixedIncome, debts, fleet, assets, notes, appointments
- [ ] تفعيل Supabase Auth (email + password)
- [ ] اختبار API (insert + select)
- [ ] ضبط Row Level Security (RLS) — كل يوزر يشوف بياناته بس
- [ ] اختيار EU region (Frankfurt) للـ DSGVO compliance
- [ ] تصميم نظام الـ Viewer/Accountant access في الـ database

---

## المرحلة 3 — تحويل الـ App للـ Cloud (v2.0)

- [ ] إنشاء ملف smartac_v2.html كنسخة جديدة
- [ ] استبدال الـ auth (btoa → Supabase Auth)
- [ ] تحويل loadUserData() من localStorage لـ Supabase
- [ ] تحويل save() من localStorage لـ Supabase
- [ ] تحويل transactions CRUD
- [ ] تحويل clients CRUD
- [ ] تحويل suppliers CRUD
- [ ] تحويل invoices CRUD
- [ ] تحويل recurring/fixed/employees CRUD
- [ ] تحويل debts CRUD
- [ ] تحويل fleet/assets/notes/appointments CRUD
- [ ] إضافة loading states على كل العمليات
- [ ] إضافة error handling ورسائل خطأ للمستخدم
- [ ] اختبار multi-device (موبايل + ديسكتوب بنفس الأكاونت)
- [ ] اختبار offline behavior

### Multi-account Viewer (للمحاسب)

- [ ] نظام طلب الـ Access من صاحب الأكاونت
- [ ] Viewer mode (قراءة فقط، بدون تعديل)
- [ ] قائمة بالأكاونتات اللي عنده access عليها + دخول بضغطة واحدة على الاسم

### Chat مع المحاسب

- [ ] Chat بين صاحب البزنس والمحاسب (Supabase Realtime)
- [ ] إرسال ملفات وصور في الـ chat
- [ ] إشعارات رسايل جديدة

### Gmail Integration

- [ ] Gmail OAuth login
- [ ] كتابة وإرسال إيميلات مع إرفاق ملفات
- [ ] قراءة الإيميلات من جوا البرنامج
- [ ] ربط الإيميلات بالعملاء والموردين

---

## المرحلة 4 — Freemium + Payment

- [ ] تطبيق حدود الـ Free plan في الكود
- [ ] عمل Upgrade Modal
- [ ] إعداد Stripe account احترافي
- [ ] إعداد Stripe Payment Link (€2.99/شهر)
- [ ] كتابة Supabase Edge Function تستقبل Stripe webhook
- [ ] تغيير الـ plan في الـ database أوتوماتيكيًا بعد الدفع
- [ ] إرسال إيميل تأكيد الاشتراك (Resend)
- [ ] اختبار flow كامل: دفع → plan يتغير → features تتفتح
- [ ] OCR Invoice Scanning كـ Pro feature (Claude API من الـ backend)
- [ ] Puppeteer PDF Generation كـ Pro feature (لضمان تطابق شكل الـ PDF مع الـ View)
- [ ] AI Invoice Data Extraction كـ Pro feature

---

## المرحلة 5 — Launch

- [ ] تحديث Privacy Policy لـ cloud version
- [ ] Verarbeitungsverzeichnis (سجل المعالجة الداخلي)
- [ ] Landing page احترافية على smartordiog.eu
- [ ] إعداد custom domain على Netlify
- [ ] أول TikTok/YouTube Short
- [ ] نشر عربي عن البرنامج في Facebook Groups لأصحاب المشاريع الصغيرة
- [ ] جمع أول 50 مستخدم وتسجيل الـ feedback
- [ ] تحديد pricing نهائي بناءً على الـ feedback

---

## ملاحظات

- **v1.0** = localStorage only — stable وجاهزة للتجربة
- **v1.5** = Transport Pilot (Innsbruck) + VAT System — جاري العمل عليها الآن
- **v2.0** = Cloud version — الـ production الحقيقي
- لا تبدأ المرحلة التالية قبل ما تتأكد إن المرحلة الحالية خلصت
- OCR + PDF Generation (Puppeteer) + AI Extraction = Pro features مدفوعة في v2.0
- Gmail Integration + Multi-account + Chat = v2.0 فقط (محتاجين backend)
- DATEV ASCII Export = مرحلة مستقبلية للسوق النمساوي/الألماني
- حد الـ 10 معاملات في addTransaction() (leftover من v1.0) اتشال مؤقتًا — البيزنس متاح بلا حدود لحد ما نبني نظام الـ Free plan الحقيقي في المرحلة 4

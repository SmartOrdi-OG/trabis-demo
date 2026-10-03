# Trabis — مشاركة الملفات مع المحاسب الضريبي (بافتراض وجود سيرفر)

مواصفة تصميم للباك اند (Supabase/Postgres الموجود في `supabase/`) والواجهة. مكمّلة لـ `BACKEND_HANDOFF.md`.
**ملاحظة:** الـ SQL تحت مسودة داخل المستند فقط ومش في `supabase/migrations/`، لأن أي ملف هناك بيتنشر تلقائي عند الـ push لـ `main`. تنقل لهناك بعد المراجعة.

## الفكرة: حزمة واحدة، طريقتين وصول

كل المحتوى بيتبني من نفس البيانات بنفس الكود، والفرق في طريقة الوصول:

| | السيناريو 1: المحاسب عنده حساب Trabis | السيناريو 2: المحاسب ملوش حساب |
|---|---|---|
| الوصول | يدخل بحسابه ويشوف بيانات العملاء اللي شاركوه (قراءة فقط) | يستلم PDF/ZIP من المستخدم |
| التحديث | حي: أي بند جديد بيظهر عنده فورًا | لقطة ثابتة للفترة وقت الإرسال |
| السيرفر بيعمل | صلاحيات + RLS + Audit | تخزين مؤقت لرابط تحميل آمن (اختياري) |

### محتوى الحزمة (للسيناريوهين)
1. **غلاف:** بيانات الشركة (UID، العنوان) والفترة وتاريخ التجهيز.
2. **ملخص ضريبي:** لكل شهر Netto / MwSt / Brutto للدخل والمصروف، ورصيد USt للفترة، حسب `vat_basis` (Ist/Soll) و`uva_interval` للمستخدم.
3. **البنود:** جدول كامل (تاريخ، اسم، فئة، صافي، نسبة ضريبة، ضريبة، إجمالي، رقم فاتورة، جهة، مرفق).
4. **الفواتير:** ملفات الصادر والوارد المرفقة بأسماء `YYYY-MM-DD_<Eingangs|Ausgangs>rechnung_<اسم>_<مبلغ>.pdf`.
5. **الموظفون:** لكل موظف جدول الساعات يوم بيوم، وفترات الإجازة (Krankenstand / Urlaub / Karenz / Feiertag) ورصيد الإجازات.
6. **الجهات الحكومية:** المدفوع لكل جهة (SVS، ÖGK، Finanzamt…) في الفترة.
7. **CSV/Excel** بنفس بنود (3) للاستيراد في برنامج المحاسب (الصيغة النهائية BMD/RZL/DATEV تتحدد مع المحاسب).

## السيناريو 1 — حساب محاسب مرتبط بالعميل

### الـ Schema (مسودة)
```sql
-- دور الحساب
alter table profiles add column if not exists role text not null default 'owner'
  check (role in ('owner','accountant'));

-- دعوة (المالك يدعو بالإيميل)
create table accountant_invites (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users on delete cascade,
  email text not null,
  token_hash text not null,                 -- هاش الـ token، مش الـ token نفسه
  scopes jsonb not null default '{"transactions":true,"invoices":true,"employees":true,"government":true}',
  expires_at timestamptz not null default now() + interval '7 days',
  status text not null default 'pending' check (status in ('pending','accepted','revoked','expired')),
  created_at timestamptz default now()
);

-- صلاحية فعلية بعد القبول
create table accountant_access (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users on delete cascade,
  accountant_id uuid not null references auth.users on delete cascade,
  scopes jsonb not null,
  valid_from date,                          -- اختياري: يحصر الفترة المتاحة
  valid_to date,
  revoked_at timestamptz,
  created_at timestamptz default now(),
  unique (owner_id, accountant_id)
);

-- سجل الاطلاع (DSGVO: المالك يشوف مين فتح إيه ومتى)
create table accountant_audit (
  id bigint generated always as identity primary key,
  owner_id uuid not null, accountant_id uuid not null,
  action text not null,                     -- view_month | download_file | export_package
  object text, at timestamptz default now()
);

-- دالة الصلاحية: بتتستخدم في كل سياسة قراءة
create function can_read(owner uuid, scope text) returns boolean
language sql stable security definer set search_path = public as $$
  select auth.uid() = owner or exists (
    select 1 from accountant_access a
    where a.owner_id = owner and a.accountant_id = auth.uid()
      and a.revoked_at is null
      and coalesce((a.scopes ->> scope)::boolean, false)
  );
$$;
```

### سياسات القراءة (تتضاف لكل جدول، قراءة فقط)
```sql
-- مثال: transactions (نفس النمط لـ invoices_issued/received, employees,
-- employee_work_hours, employee_leave, contacts, receipts…)
create policy "accountant read transactions" on transactions
  for select using (can_read(user_id, 'transactions'));
```
- **مفيش أي سياسة insert/update/delete للمحاسب**: القراءة فقط على مستوى الداتابيز، مش على مستوى الواجهة.
- **الملفات:** سياسة `select` على `storage.objects` لـ `receipts` و`employee-documents` لما `can_read((storage.foldername(name))[1]::uuid, 'invoices' | 'employees')`.
- **الفترة:** لو `valid_from/valid_to` متحددين، الدالة تضيف شرط على تاريخ البند.

### الـ API / الـ Edge Functions
| النقطة | الوظيفة |
|---|---|
| `POST /accountant/invite` {email, scopes} | المالك ينشئ دعوة ويتبعت إيميل برابط فيه token |
| `POST /accountant/accept` {token} | المحاسب (بعد تسجيل/دخول بدور accountant) يقبل الدعوة، فيتعمل صف `accountant_access` |
| `DELETE /accountant/access/:id` | المالك يلغي الصلاحية فورًا (`revoked_at`) |
| `GET /accountant/clients` | قائمة العملاء اللي شاركوه (اسم الشركة، آخر نشاط) |
| `GET /months/{year}/{month}?owner=<id>` | نفس endpoint شاشة الشهر، لكن بيتحقق من `can_read` |
| `POST /accountant/audit` | تسجيل كل فتح شهر/تنزيل ملف |

### الواجهة
- **عند المالك (Settings → "المحاسب الضريبي"):** إدخال إيميل المحاسب واختيار ما يشاركه (بنود/فواتير/موظفين/جهات حكومية) ومدة الصلاحية، قائمة بالمحاسبين المرتبطين بزرار "إلغاء"، وسجل "مين اطلع على إيه".
- **عند المحاسب (`buchhalter.html` يتحول لواجهة حقيقية):** تسجيل دخول → قائمة العملاء → اختيار عميل وفترة → نفس شاشات الشهر بشكل قراءة فقط → زرار **"تنزيل الحزمة"** (ZIP/PDF بنفس محتوى الحزمة).
- **تنبيه للمالك** لما المحاسب يقبل الدعوة أو ينزّل حزمة.

## السيناريو 2 — المحاسب ملوش حساب

1. المستخدم يدوس **"تجهيز حزمة للمحاسب"**، يختار الفترة (شهر / ربع / سنة) والمحتوى (فواتير، موظفين، جهات حكومية).
2. الواجهة تبني الحزمة من بيانات الـ API (نفس الكود في الحالتين): **PDF واحد** (غلاف + ملخص + جدول + ملحق لكل موظف + الفواتير مدمجة)، وبجانبه **ZIP** فيه الـ PDF + CSV + الملفات الأصلية.
3. طريقتان للإرسال:
   - **من الجهاز:** Web Share API (WhatsApp / Mail / AirDrop) أو تنزيل مباشر.
   - **برابط آمن (يحتاج السيرفر):** الواجهة ترفع الـ ZIP لـ bucket خاص `exports`، والسيرفر ينشئ **signed URL ينتهي بعد 7 أيام** ويبعته للمحاسب بإيميل (Edge Function) من غير ما المحاسب يحتاج حساب. ده الحل لما الحزمة تكون كبيرة على المرفقات.

```sql
create table exports (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users on delete cascade,
  period_from date not null, period_to date not null,
  storage_path text not null, sent_to text, expires_at timestamptz not null,
  created_at timestamptz default now()
);
alter table exports enable row level security;
create policy "owner manages exports" on exports using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
```
- bucket `exports`: خاص، المالك بس يكتب ويقرأ، والتحميل للمحاسب بـ signed URL فقط، وحذف تلقائي بعد الانتهاء (cron).

## الأمان والـ DSGVO
- **أقل صلاحية:** المالك يختار النطاق (scopes) والفترة، والمحاسب ما يشوفش غيرها.
- **الإلغاء فوري:** `revoked_at` ويتحقق منه في كل طلب عبر `can_read`.
- **السجل:** كل اطلاع وتنزيل في `accountant_audit` والمالك يشوفه.
- **التخزين في الاتحاد الأوروبي (Frankfurt)** كما هو في الإعداد الحالي.
- **عقد معالجة بيانات (AVV):** لازم يتوقع بين المالك والمحاسب، وبين Trabis ومقدّم الاستضافة.
- **بيانات حساسة:** مستندات الموظفين (إجازة مرضية…) بنطاق منفصل `employees` ما يتشاركش إلا بقرار صريح.

## ترتيب التنفيذ المقترح
1. **حزمة الـ PDF/ZIP من الواجهة** مع Web Share: مفيش سيرفر لازم، وتغطي السيناريو 2 فورًا.
2. **جداول الدعوة والصلاحية + `can_read` + سياسات القراءة** على الجداول والملفات.
3. **دعوة/قبول/إلغاء** وواجهة المالك في Settings.
4. **تحويل `buchhalter.html` لواجهة حقيقية** بتقرأ من الـ API.
5. **bucket `exports` والرابط الآمن بالإيميل.**
6. **ملاحظات/استفسارات المحاسب على البنود** (جدول `accountant_notes` بصلاحية كتابة منفصلة): مرحلة لاحقة.

## أسئلة مفتوحة
- صيغة التصدير النهائية: Excel عادي أم BMD/RZL/DATEV؟
- هل نحتاج إتاحة بند "مراجَع من المحاسب" (علامة تأكيد) في المرحلة 1؟
- هل المحاسب الواحد يخدم أكتر من عميل في نفس الحساب؟ (التصميم بيدعم ده فعلاً.)

# SmartAc — Backend Handoff

مستند مختصر لأي باك اند هيشتغل على نقل SmartAc من نسخة الـ prototype (localStorage بس، من غير سيرفر) لنسخة حقيقية على سيرفر (v2.0). اقرأ ده الأول قبل ما تبص على الكود.

## الوضع الحالي (مهم تفهمه قبل أي حاجة)

- `index.html` ده كل التطبيق (HTML/CSS/JS في ملف واحد، من غير build step ولا framework). بيتفتح مباشرة في المتصفح، ومنشور دلوقتي على Vercel كـ static file بس — يعني Vercel بتقدّم الملف زي ما هو، مفيش سيرفر شغال فعليًا.
- **مفيش backend ولا database حقيقية دلوقتي.** كل بيانات المستخدم (معاملات، عملاء، فواتير، موظفين، إلخ) متخزنة في `localStorage` و`IndexedDB` **في متصفح المستخدم نفسه**، مفيش أي مزامنة بين الأجهزة، ومفيش حماية حقيقية (كلمة السر متخزنة بـ `btoa` بس، مش تشفير فعلي).
- ده معناه: أي جهاز/متصفح جديد = بيانات فاضية من الصفر. لو المستخدم مسح الـ cache، بياناته راحت.
- تفاصيل أكتر عن البنية الحالية موجودة في [`README.md`](README.md).

## المطلوب فعليًا

نقل التطبيق لمعمارية حقيقية: **Auth + Database + File Storage على سيرفر**، والكود الحالي (اللي دلوقتي بيقرأ/يكتب على `localStorage` مباشرة) يتحول يكلم الـ backend ده بدل كده.

## اللي اتعمل فيه شغل قبل كده (خلفية Supabase الموجودة)

اتعمل تحضير مسبق باستخدام **Supabase** (Postgres + Auth + Storage managed) على منطقة **Frankfurt (eu-central-1)** لأسباب الـ DSGVO (البيانات تفضل جوا الاتحاد الأوروبي):

- **الـ Schema كامل**: 21 جدول في [`supabase/migrations/20260712120000_initial_schema.sql`](supabase/migrations/20260712120000_initial_schema.sql) — بيغطي كل فيتشرات التطبيق (transactions, clients, suppliers, employees + work hours + documents, invoices صادرة/واردة, fleet + maintenance, assets, inventory, notes, appointments, debts, recurring/fixed income, installments, UVA approvals, receipts).
- **Row Level Security (RLS) مفعّل على كل جدول**: كل يوزر يشوف/يعدّل بياناته هو بس (`auth.uid() = user_id`)، ونفس المبدأ على Supabase Storage.
- **Storage buckets**: `receipts` و`employee-documents` جاهزين (بالـ RLS بتاعتهم كمان).
- **Trigger أوتوماتيك**: أي يوزر جديد يعمل signup، صف `profiles` بتاعه بيتعمل تلقائيًا.
- **Supabase Auth (email + password) مفعّل** بالفعل على مستوى المشروع.
- **نشر أوتوماتيك للـ migrations**: أي تعديل في `supabase/migrations/**` بيتنشر تلقائي عند الـ push لـ `main` عن طريق [`.github/workflows/supabase-migrations.yml`](.github/workflows/supabase-migrations.yml) (GitHub Actions + Supabase CLI).
- الـ schema ده **Postgres عادي** — مش حاجة خاصة بـ Supabase تحديدًا، فحتى لو قررتوا متستخدموش Supabase، تقدروا تاخدوا نفس ملف الـ SQL وتشغّلوه على أي Postgres server عادي.

## قرار مطلوب منكم: تستخدموا Supabase ولا سيرفركم الخاص؟

| | استخدام Supabase (الموجود أصلاً) | سيرفر خاص بيكم |
|---|---|---|
| Auth | جاهز ومفعّل، بس محتاج ربط بالكود | تبنوه من الصفر (أو تستخدموا حاجة زي Auth.js/Passport) |
| Database + RLS | جاهزين، Schema كامل ومختبر | تاخدوا نفس ملف الـ SQL كـ نقطة بداية، لكن الـ RLS بالصيغة دي مرتبطة بـ `auth.uid()` بتاعة Supabase Auth تحديدًا — لو غيرتوا نظام الـ Auth هتحتاجوا تراجعوا منطق الحماية |
| File Storage | Buckets جاهزة | تحتاجوا حل تخزين ملفات بديل (S3 مثلاً) |
| النشر/الاستضافة | Supabase managed، مفيش سيرفر تديروه | لازم تديروا السيرفر بنفسكم |
| السرعة للإطلاق | الأسرع — البنية التحتية شغالة أصلاً | وقت إضافي لإعادة بناء نفس الحاجات |

**التوصية**: لو مفيش سبب قوي (مثلاً عندكم عقد/بنية تحتية مفروضة عليكم)، الأسرع إنكم تستخدموا Supabase الموجود بدل ما تبنوا من الصفر — كل الشغل الصعب (الـ Schema والـ RLS) خلصان ومتأكد منه.

## اللي لسه ما اتعملش (ده شغلكم الأساسي)

الكود في `index.html` **لسه بيستخدم `localStorage` بالكامل** — مفيش أي اتصال فعلي بـ Supabase (أو أي backend) لسه. التفاصيل الكاملة (checklist) موجودة في [`TODO.md`](TODO.md) تحت قسم **"المرحلة 3 — تحويل الـ App للـ Cloud (v2.0)"**، وأهمها:

- استبدال نظام تسجيل الدخول الحالي (`btoa` + localStorage) بـ Supabase Auth
- تحويل دالتي `loadUserData()` و`save()` (نقطة الدخول لكل قراءة/كتابة بيانات في التطبيق) من localStorage لـ Supabase
- تحويل كل الـ CRUD operations (معاملات، عملاء، موردين، فواتير، موظفين، ديون، أسطول، أصول، ملاحظات، مواعيد...) واحدة واحدة
- رفع الملفات (إيصالات، مستندات موظفين، أرشيف) فعليًا على Storage بدل IndexedDB المحلي
- Loading states + error handling على كل عملية
- اختبار multi-device حقيقي (نفس الحساب من جهازين مختلفين)

## نقطة مهمة: تسجيل الدخول بجوجل

اتسأل عن ده قبل كده — مش ممكن يتضاف كـ patch بسيط على النظام الحالي، لازم يجي **بعد** خطوة "استبدال الـ Auth" فوق، لأن Google OAuth محتاج domain حقيقي + session سيرفر، مش localStorage. لو استخدمتوا Supabase Auth، إضافة Google بعد كده هتبقى: عمل OAuth Client في Google Cloud Console + تفعيل الـ provider في إعدادات Supabase Auth + زرار "Sign in with Google" بينادي `signInWithOAuth`.

## طلب Access

لو هتستخدموا Supabase الموجود، هتحتاجوا Access على المشروع من صاحبه (Frankfurt project) — كلموه يضيفكوا كـ team member من Supabase Dashboard.

/* =========================================
   🌊 شمال المغرب
   MAIN.JS
   تشغيل الموقع
========================================= */


/* =========================================
   خدمات الموقع
   فتح / إغلاق البطاقات
========================================= */

function toggleActionCard(card) {

  if (!card) return;

  const isOpen =
    card.classList.contains("card-open");

  document
    .querySelectorAll(".action-card.card-open")
    .forEach(openCard => {

      if (openCard !== card) {
        openCard.classList.remove("card-open");
      }

    });

  if (isOpen) {

    card.classList.remove("card-open");

  } else {

    card.classList.add("card-open");

  }

}


/* =========================================
   التشغيل الرئيسي
========================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    console.log(
      "🌊 شمال المغرب — بدء تشغيل الموقع"
    );


    /* =====================================
       🏨 الإقامات
    ===================================== */

    if (
      typeof loadAccommodations ===
      "function"
    ) {

      loadAccommodations();

    } else {

      console.error(
        "❌ loadAccommodations غير موجودة"
      );

    }


    /* =====================================
       🚗 المواصلات
    ===================================== */

    if (
      typeof loadTransportServices ===
      "function"
    ) {

      loadTransportServices();

    } else {

      console.error(
        "❌ loadTransportServices غير موجودة"
      );

    }


    /* =====================================
       🗺️ الرحلات والمرشدون
    ===================================== */

    if (
      typeof loadActivities ===
      "function"
    ) {

      loadActivities();

    } else {

      console.error(
        "❌ loadActivities غير موجودة"
      );

    }


    /* =====================================
       📋 طلب الخدمة
       requests.js مسؤول عن الربط
    ===================================== */

    const requestForm =
      document.getElementById(
        "serviceRequestForm"
      );

    if (requestForm) {

      console.log(
        "✅ نموذج طلب الخدمة موجود"
      );

    }


    /* =====================================
       🏢 طلب مقدم الخدمة
       providers.js مسؤول عن الربط
    ===================================== */

    const providerForm =
      document.getElementById(
        "providerApplicationForm"
      );

    if (providerForm) {

      console.log(
        "✅ نموذج مقدم الخدمة موجود"
      );

    }


    /* =====================================
       ⭐ التقييمات
       يتم تشغيلها بعد إنشاء البطاقات
    ===================================== */

    /*
       لا نشغل initReviews هنا مباشرة،
       لأن البطاقات يتم إنشاؤها
       بشكل غير متزامن من Supabase.

       loadAccommodations / transport /
       activities ستنشئ البطاقات أولاً.
    */


    /* =====================================
       🔎 البحث
       search.js مسؤول عن البحث
    ===================================== */

    if (
      typeof initGlobalSearch ===
      "function"
    ) {

      initGlobalSearch();

    }


    console.log(
      "🌊 شمال المغرب — تم تشغيل جميع الخدمات"
    );

  }
);

ملاحظة مهمة: في كودك الحالي، "accommodations.js" يستدعي "initReviews()" بعد تحميل الإقامات، بينما المواصلات والأنشطة لا يفعلان ذلك. لذلك بعد إصلاح "main.js" قد تظهر الإقامات أولًا، لكن سنحتاج لاحقًا إلى ضبط توقيت التقييمات لكل البطاقات بدون تخريب التحميل.

وأيضًا لن أضع تحميلًا مزدوجًا للنماذج في "main.js" لأن "requests.js" و"providers.js" هما المسؤولان عن الإرسال.

/* =========================================
   🌊 شمال المغرب
   MAIN.JS — نسخة التشخيص
========================================= */


/* =========================================
   فتح / إغلاق بطاقات خدمات الموقع
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

  card.classList.toggle("card-open");
}


/* =========================================
   رسالة التشخيص
========================================= */

function showMainStatus(message) {

  let box =
    document.getElementById("mainDebugMessage");

  if (!box) {

    box = document.createElement("div");

    box.id = "mainDebugMessage";

    box.style.cssText = `
      margin:15px;
      padding:12px;
      background:#fff3cd;
      border:1px solid #ffc107;
      border-radius:10px;
      color:#664d03;
      font-size:14px;
      direction:rtl;
      text-align:right;
    `;

    document.body.prepend(box);
  }

  box.innerHTML += `<div>${message}</div>`;
}


/* =========================================
   التشغيل
========================================= */

document.addEventListener(
  "DOMContentLoaded",
  async () => {

    showMainStatus(
      "🔄 بدأ تشغيل الموقع..."
    );


    /* =====================================
       التحقق من Supabase
    ===================================== */

    if (
      typeof SUPABASE_URL === "undefined" ||
      typeof SUPABASE_KEY === "undefined"
    ) {

      showMainStatus(
        "❌ خطأ: SUPABASE_URL أو SUPABASE_KEY غير موجود."
      );

      return;
    }

    showMainStatus(
      "✅ إعدادات Supabase موجودة."
    );


    /* =====================================
       🏨 الإقامات
    ===================================== */

    if (
      typeof loadAccommodations ===
      "function"
    ) {

      showMainStatus(
        "▶️ تشغيل تحميل الإقامات..."
      );

      try {

        await loadAccommodations();

        showMainStatus(
          "✅ انتهى تشغيل تحميل الإقامات."
        );

      } catch (error) {

        console.error(error);

        showMainStatus(
          "❌ خطأ في loadAccommodations: " +
          escapeHTML(
            error.message || String(error)
          )
        );

      }

    } else {

      showMainStatus(
        "❌ الدالة loadAccommodations غير موجودة."
      );

    }


    /* =====================================
       🚗 المواصلات
    ===================================== */

    if (
      typeof loadTransportServices ===
      "function"
    ) {

      showMainStatus(
        "▶️ تشغيل تحميل المواصلات..."
      );

      try {

        await loadTransportServices();

        showMainStatus(
          "✅ انتهى تشغيل تحميل المواصلات."
        );

      } catch (error) {

        console.error(error);

        showMainStatus(
          "❌ خطأ في loadTransportServices: " +
          escapeHTML(
            error.message || String(error)
          )
        );

      }

    } else {

      showMainStatus(
        "❌ الدالة loadTransportServices غير موجودة."
      );

    }


    /* =====================================
       🗺️ الأنشطة والرحلات
    ===================================== */

    if (
      typeof loadActivities ===
      "function"
    ) {

      showMainStatus(
        "▶️ تشغيل تحميل الأنشطة..."
      );

      try {

        await loadActivities();

        showMainStatus(
          "✅ انتهى تشغيل تحميل الأنشطة."
        );

      } catch (error) {

        console.error(error);

        showMainStatus(
          "❌ خطأ في loadActivities: " +
          escapeHTML(
            error.message || String(error)
          )
        );

      }

    } else {

      showMainStatus(
        "❌ الدالة loadActivities غير موجودة."
      );

    }


    /* =====================================
       🔎 البحث
    ===================================== */

    if (
      typeof initGlobalSearch ===
      "function"
    ) {

      initGlobalSearch();

      showMainStatus(
        "✅ البحث يعمل."
      );

    } else {

      showMainStatus(
        "⚠️ دالة البحث غير موجودة."
      );

    }


    /* =====================================
       📋 نموذج طلب الخدمة
    ===================================== */

    const requestForm =
      document.getElementById(
        "serviceRequestForm"
      );

    if (requestForm) {

      showMainStatus(
        "✅ نموذج طلب الخدمة موجود."
      );

    } else {

      showMainStatus(
        "❌ نموذج طلب الخدمة غير موجود."
      );

    }


    /* =====================================
       🏢 نموذج مقدم الخدمة
    ===================================== */

    const providerForm =
      document.getElementById(
        "providerApplicationForm"
      );

    if (providerForm) {

      showMainStatus(
        "✅ نموذج مقدم الخدمة موجود."
      );

    } else {

      showMainStatus(
        "❌ نموذج مقدم الخدمة غير موجود."
      );

    }


    showMainStatus(
      "🏁 انتهى التشخيص."
    );

  }
);

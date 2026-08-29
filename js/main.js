/* =========================================
   🌊 شمال المغرب
   MAIN.JS
   ملف التشغيل الرئيسي
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

  if (isOpen) {

    card.classList.remove("card-open");

  } else {

    card.classList.add("card-open");

  }

}


/* =========================================
   البحث العام
========================================= */

function initGlobalSearch() {

  const searchInput =
    document.getElementById("globalSearch");

  const message =
    document.getElementById("searchMessage");

  if (!searchInput) return;

  if (
    searchInput.dataset.initialized === "true"
  ) {
    return;
  }

  searchInput.dataset.initialized = "true";


  searchInput.addEventListener(
    "input",
    performGlobalSearch
  );


}


/* =========================================
   تنفيذ البحث
========================================= */

function performGlobalSearch() {

  const searchInput =
    document.getElementById("globalSearch");

  const message =
    document.getElementById("searchMessage");

  if (!searchInput) return;


  const query =
    searchInput.value
      .trim()
      .toLowerCase();


  const cards =
    document.querySelectorAll(
      ".accommodation-card, .service-card"
    );


  let found = 0;


  cards.forEach(card => {

    /* استثناء بطاقات خدمات الموقع */

    if (
      card.classList.contains("action-card") ||
      card.closest("#services-actions")
    ) {
      return;
    }


    const text =
      (card.textContent || "")
        .toLowerCase();


    if (!query) {

      card.style.display = "";

      found++;

      return;
    }


    if (text.includes(query)) {

      card.style.display = "";

      found++;

    } else {

      card.style.display = "none";

    }

  });


  /* إظهار / إخفاء عناوين الأقسام */

  document
    .querySelectorAll(
      ".accommodation-category"
    )
    .forEach(category => {

      const cards =
        category.querySelectorAll(
          ".accommodation-card, .service-card"
        );


      let visible = false;


      cards.forEach(card => {

        if (
          !card.classList.contains("action-card") &&
          card.style.display !== "none"
        ) {
          visible = true;
        }

      });


      /*
         إذا لم تكن هناك بطاقات فعلية
         نترك القسم ظاهرًا.
      */

      if (cards.length > 0) {

        category.style.display =
          visible ? "" : "none";

      }

    });


  /* رسالة البحث */

  if (!message) return;


  if (!query) {

    message.textContent = "";

    return;

  }


  message.textContent =
    found > 0
      ? `🔎 تم العثور على ${found} خدمة.`
      : "🔎 لم يتم العثور على خدمة مطابقة.";

}


/* =========================================
   تشغيل الموقع
========================================= */

async function initSite() {

  console.log(
    "🌊 شمال المغرب — بدء تشغيل الموقع"
  );


  /* =======================================
     البحث
  ======================================= */

  initGlobalSearch();


  /* =======================================
     تحميل الإقامات
  ======================================= */

  if (
    typeof loadAccommodations === "function"
  ) {

    console.log(
      "🏨 تحميل الإقامات..."
    );

    await loadAccommodations();

  } else {

    console.error(
      "❌ loadAccommodations غير موجودة"
    );

  }


  /* =======================================
     تحميل المواصلات
  ======================================= */

  if (
    typeof loadTransportServices === "function"
  ) {

    console.log(
      "🚗 تحميل المواصلات..."
    );

    await loadTransportServices();

  } else {

    console.error(
      "❌ loadTransportServices غير موجودة"
    );

  }


  /* =======================================
     تحميل الرحلات والمرشدين
  ======================================= */

  if (
    typeof loadActivities === "function"
  ) {

    console.log(
      "🗺️ تحميل الأنشطة والرحلات والمرشدين..."
    );

    await loadActivities();

  } else {

    console.error(
      "❌ loadActivities غير موجودة"
    );

  }


  /* =======================================
     تشغيل التقييمات بعد ظهور البطاقات
  ======================================= */

  if (
    typeof initReviews === "function"
  ) {

    console.log(
      "⭐ تشغيل التقييمات..."
    );

    initReviews();

  }


  console.log(
    "✅ شمال المغرب — انتهى تشغيل الموقع"
  );

}


/* =========================================
   التشغيل بعد تحميل HTML
========================================= */

document.addEventListener(
  "DOMContentLoaded",
  initSite
);

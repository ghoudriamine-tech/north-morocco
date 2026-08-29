/* =========================================
   🌊 شمال المغرب
   MAIN.JS
========================================= */


/* =========================================
   خدمات الموقع
   فتح وإغلاق البطاقات
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
   🔎 البحث
========================================= */

function initGlobalSearch() {

  const search =
    document.getElementById("globalSearch");

  if (!search) return;

  if (search.dataset.initialized === "true") {
    return;
  }

  search.dataset.initialized = "true";

  search.addEventListener(
    "input",
    performGlobalSearch
  );

}


/* =========================================
   تنفيذ البحث
========================================= */

function performGlobalSearch() {

  const search =
    document.getElementById("globalSearch");

  const message =
    document.getElementById("searchMessage");

  if (!search) return;

  const query =
    search.value
      .trim()
      .toLowerCase();

  if (!query) {

    clearSearchResults();

    if (message) {
      message.textContent = "";
    }

    return;
  }

  let found = 0;

  document
    .querySelectorAll(
      ".accommodation-card, .service-card"
    )
    .forEach(card => {

      if (
        card.classList.contains("action-card")
      ) {
        return;
      }

      const text =
        (card.textContent || "")
          .toLowerCase();

      if (text.includes(query)) {

        card.style.display = "";
        found++;

      } else {

        card.style.display = "none";

      }

    });


  document
    .querySelectorAll(
      ".accommodation-category"
    )
    .forEach(category => {

      const visibleCards =
        Array.from(
          category.querySelectorAll(
            ".accommodation-card, .service-card"
          )
        )
        .filter(card =>
          card.style.display !== "none"
        );

      category.style.display =
        visibleCards.length
          ? ""
          : "none";

    });


  if (message) {

    message.textContent =
      found > 0
        ? `🔎 تم العثور على ${found} خدمة.`
        : "🔎 لم يتم العثور على خدمة مطابقة.";

  }

}


/* =========================================
   إلغاء البحث
========================================= */

function clearSearchResults() {

  document
    .querySelectorAll(
      ".accommodation-card, .service-card"
    )
    .forEach(card => {

      if (
        !card.classList.contains("action-card")
      ) {

        card.style.display = "";

      }

    });


  document
    .querySelectorAll(
      ".accommodation-category"
    )
    .forEach(category => {

      category.style.display = "";

    });

}


/* =========================================
   التشغيل الرئيسي
========================================= */

document.addEventListener(
  "DOMContentLoaded",
  async () => {

    console.log(
      "🌊 شمال المغرب — MAIN.JS يعمل"
    );


    /* البحث */

    initGlobalSearch();


    /* =====================================
       🏨 تحميل الإقامات
    ===================================== */

    if (
      typeof loadAccommodations ===
      "function"
    ) {

      await loadAccommodations();

    }


    /* =====================================
       🚗 تحميل المواصلات
    ===================================== */

    if (
      typeof loadTransportServices ===
      "function"
    ) {

      await loadTransportServices();

    }


    /* =====================================
       🗺️ تحميل الرحلات والمرشدين
    ===================================== */

    if (
      typeof loadActivities ===
      "function"
    ) {

      await loadActivities();

    }


    /* =====================================
       ⭐ تشغيل التقييمات
       بعد ظهور جميع البطاقات
    ===================================== */

    if (
      typeof initReviews ===
      "function"
    ) {

      initReviews();

    }


    console.log(
      "✅ تم تشغيل جميع خدمات الموقع"
    );

  }
);

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

  search.addEventListener(
    "input",
    performGlobalSearch
  );
}


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
    .querySelectorAll(".accommodation-card")
    .forEach(card => {

      /* استثناء خدمات الموقع */
      if (
        card.classList.contains("action-card")
      ) {
        return;
      }

      const text =
        card.textContent.toLowerCase();

      if (text.includes(query)) {

        card.style.display = "";
        found++;

      } else {

        card.style.display = "none";

      }

    });


  if (message) {

    message.textContent =
      found
        ? `🔎 تم العثور على ${found} خدمة.`
        : "❌ لم يتم العثور على خدمة مطابقة.";

  }
}


/* =========================================
   إلغاء البحث
========================================= */

function clearSearchResults() {

  document
    .querySelectorAll(".accommodation-card")
    .forEach(card => {

      if (
        !card.classList.contains(
          "action-card"
        )
      ) {

        card.style.display = "";

      }

    });
}


/* =========================================
   التشغيل
========================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    console.log(
      "🌊 شمال المغرب — main.js يعمل"
    );

    /*
       تشغيل البحث
    */

    initGlobalSearch();

    /*
       ملاحظة:
       الإقامات والمواصلات والأنشطة
       يتم تشغيلها من ملفاتها الخاصة.
    */

  }
);

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

  /*
     منع تكرار تشغيل البحث
  */

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

  /*
     إذا كان البحث فارغًا
  */

  if (!query) {

    clearSearchResults();

    if (message) {
      message.textContent = "";
    }

    return;
  }


  let found = 0;


  /*
     البحث داخل بطاقات الخدمات
     مع استثناء بطاقات الإجراءات
  */

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


  /*
     رسالة البحث
  */

  if (message) {

    message.textContent =
      found > 0
        ? `🔎 تم العثور على ${found} خدمة.`
        : "❌ لم يتم العثور على خدمة مطابقة.";

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
       تشغيل البحث فقط
       لا يوجد هنا أي تحميل من Supabase
    */

    initGlobalSearch();

  }
);

/* =========================================
   🌊 شمال المغرب
   MAIN.JS
========================================= */

function toggleActionCard(card) {

  if (!card) return;

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
   التشغيل
========================================= */

document.addEventListener(
  "DOMContentLoaded",
  function () {

    console.log("🌊 MAIN JS يعمل");


    /* الإقامات */

    if (
      typeof loadAccommodations === "function"
    ) {

      loadAccommodations();

    }


    /* المواصلات */

    if (
      typeof loadTransportServices === "function"
    ) {

      loadTransportServices();

    }


    /* الأنشطة والمرشدون */

    if (
      typeof loadActivities === "function"
    ) {

      loadActivities();

    }


    /* البحث */

    if (
      typeof initGlobalSearch === "function"
    ) {

      initGlobalSearch();

    }

  }
);

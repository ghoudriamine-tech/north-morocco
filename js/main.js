/* =========================================
   🌊 شمال المغرب
   MAIN.JS
========================================= */

document.addEventListener("DOMContentLoaded", () => {

  console.log("🌊 شمال المغرب — بدء التشغيل");

  /* البحث */
  if (typeof initGlobalSearch === "function") {
    initGlobalSearch();
  }

  /* الإقامات */
  if (typeof loadAccommodations === "function") {
    loadAccommodations();
  }

  /* المواصلات */
  if (typeof loadTransportServices === "function") {
    loadTransportServices();
  }

  /* الرحلات والمرشدون */
  if (typeof loadActivities === "function") {
    loadActivities();
  }

});

/* =========================================
   🌊 شمال المغرب
   فحص تشغيل الملفات
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


document.addEventListener("DOMContentLoaded", function () {

  const checks = [];

  checks.push(
    typeof loadAccommodations === "function"
      ? "✅ accommodations.js"
      : "❌ accommodations.js"
  );

  checks.push(
    typeof loadTransportServices === "function"
      ? "✅ transport.js"
      : "❌ transport.js"
  );

  checks.push(
    typeof loadActivities === "function"
      ? "✅ activities.js"
      : "❌ activities.js"
  );

  checks.push(
    typeof supabaseHeaders === "function"
      ? "✅ supabase.js"
      : "❌ supabase.js"
  );

  checks.push(
    typeof SUPABASE_URL !== "undefined"
      ? "✅ config.js"
      : "❌ config.js"
  );


  const box = document.createElement("div");

  box.style.cssText =
    "position:fixed;top:0;left:0;right:0;" +
    "z-index:99999;background:#fff;" +
    "padding:15px;font-size:16px;" +
    "direction:rtl;border-bottom:2px solid #000;";

  box.innerHTML =
    "<strong>فحص الملفات:</strong><br>" +
    checks.join("<br>");

  document.body.prepend(box);


  /* تشغيل البيانات */

  if (typeof loadAccommodations === "function") {
    loadAccommodations();
  }

  if (typeof loadTransportServices === "function") {
    loadTransportServices();
  }

  if (typeof loadActivities === "function") {
    loadActivities();
  }

  if (typeof initGlobalSearch === "function") {
    initGlobalSearch();
  }

});

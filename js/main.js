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


document.addEventListener("DOMContentLoaded", function () {

  console.log("MAIN JS OK");

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

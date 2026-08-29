/* =========================================
   🌊 شمال المغرب
   التشغيل + البحث
========================================= */

document.addEventListener("DOMContentLoaded", () => {

  if (typeof loadAccommodations === "function") {
    loadAccommodations();
  }

  if (typeof loadTransportServices === "function") {
    loadTransportServices();
  }

  if (typeof loadActivities === "function") {
    loadActivities();
  }

  setupGlobalSearch();

});


/* =========================================
   🔎 البحث العام
========================================= */

function setupGlobalSearch() {

  const input =
    document.getElementById("globalSearch");

  const message =
    document.getElementById("searchMessage");

  if (!input) return;

  input.addEventListener("input", () => {

    const query =
      input.value.trim().toLowerCase();

    const cards =
      document.querySelectorAll(
        ".accommodation-card"
      );

    let count = 0;

    cards.forEach(card => {

      if (!query) {
        card.style.display = "";
        return;
      }

      const text =
        (card.textContent || "").toLowerCase();

      const match =
        text.includes(query);

      card.style.display =
        match ? "" : "none";

      if (match) count++;

    });

    if (!message) return;

    if (!query) {

      message.textContent = "";

    } else if (count) {

      message.textContent =
        `🔎 تم العثور على ${count} خدمة.`;

    } else {

      message.textContent =
        "لم يتم العثور على نتائج مطابقة.";

    }

  });

}


/* =========================================
   🔐 حماية HTML
========================================= */

function escapeHTML(value) {

  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


/* =========================================
   🔐 حماية JavaScript
========================================= */

function escapeJS(value) {

  return String(value ?? "")
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r");

}


/* =========================================
   ⚠️ رسالة الخطأ
========================================= */

function showError(id) {

  const container =
    document.getElementById(id);

  if (container) {

    container.innerHTML =
      '<p class="empty">تعذر تحميل البيانات حالياً.</p>';

  }

                  }

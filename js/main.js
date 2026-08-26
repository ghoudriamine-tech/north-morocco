/* =========================================
   🌊 شمال المغرب
   تشغيل الموقع
========================================= */

document.addEventListener(
  "DOMContentLoaded",
  function () {

    /* الإقامات */
    if (typeof loadAccommodations === "function") {
      loadAccommodations();
    }


    /* المواصلات */
    if (typeof loadTransportServices === "function") {
      loadTransportServices();
    }


    /* الأنشطة */
    if (typeof loadActivities === "function") {
      loadActivities();
    }


    /* نموذج طلب الخدمة */
    const form =
      document.getElementById(
        "serviceRequestForm"
      );


    if (form) {

      form.addEventListener(
        "submit",
        submitServiceRequest
      );

    }

  }
);


/* =========================================
   حماية HTML
========================================= */

function escapeHTML(value) {

  return String(value)

    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


/* =========================================
   حماية JavaScript
========================================= */

function escapeJS(value) {

  return String(value)

    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r");

}


/* =========================================
   رسالة الخطأ العامة
========================================= */

function showError(id) {

  const container =
    document.getElementById(id);


  if (!container) return;


  container.innerHTML = `
    <p class="empty">
      تعذر تحميل البيانات حالياً.
    </p>
  `;

}

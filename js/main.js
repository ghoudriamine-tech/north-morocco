/* =========================================
   🌊 شمال المغرب
   تشغيل الموقع
========================================= */

document.addEventListener(
  "DOMContentLoaded",
  function () {

    // الإقامات
    loadAccommodations();

    // المواصلات
    loadTransportServices();

    // نموذج طلب الخدمة
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
   رسالة الخطأ
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

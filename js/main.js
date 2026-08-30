/* =========================================
   🌊 شمال المغرب
   MAIN.JS
   تشغيل الموقع فقط
   بدون رسائل فحص ظاهرة
========================================= */


/* =========================================
   تشغيل الموقع
========================================= */

document.addEventListener("DOMContentLoaded", async () => {

  console.log("North Morocco site started.");

  /* الإقامات */
  if (typeof loadAccommodations === "function") {
    await loadAccommodations();
  }

  /* المواصلات */
  if (typeof loadTransportServices === "function") {
    await loadTransportServices();
  }

  /* الرحلات والمرشدون */
  if (typeof loadActivities === "function") {
    await loadActivities();
  }

  /* التقييمات */
  if (typeof initReviews === "function") {
    initReviews();
  }

  /* البحث */
  if (typeof initGlobalSearch === "function") {
    initGlobalSearch();
  }

  /* طلب الخدمة */
  if (typeof initServiceRequests === "function") {
    initServiceRequests();
  }

  /* طلب مقدم الخدمة */
  if (typeof submitProviderApplication === "function") {

    const providerForm =
      document.getElementById(
        "providerApplicationForm"
      );

    if (providerForm) {

      providerForm.addEventListener(
        "submit",
        submitProviderApplication
      );

    }

  }

});


/* =========================================
   بطاقات خدمات الموقع
========================================= */

function toggleActionCard(card) {

  if (!card) return;

  document
    .querySelectorAll(".action-card")
    .forEach(openCard => {

      if (openCard !== card) {
        openCard.classList.remove(
          "action-card-open"
        );
      }

    });

  card.classList.toggle(
    "action-card-open"
  );

}


/* =========================================
   اختيار الخدمة
   من زر 📋 داخل البطاقة
========================================= */

function selectService(
  serviceType,
  serviceId,
  serviceName
) {

  const type =
    document.getElementById("service_type");

  const id =
    document.getElementById("service_id");

  if (type) {
    type.value = serviceType;
  }

  if (id) {
    id.value = serviceId;
  }

  /* حفظ اسم الخدمة مؤقتًا */
  window.selectedServiceName =
    serviceName || "";

  /* فتح بطاقة طلب الخدمة */

  const requestCard =
    document
      .querySelector(
        '#services-actions .action-card:nth-child(2)'
      );

  if (requestCard) {

    document
      .querySelectorAll(
        "#services-actions .action-card"
      )
      .forEach(card => {

        card.classList.remove(
          "action-card-open"
        );

      });

    requestCard.classList.add(
      "action-card-open"
    );

  }

  /* الانتقال إلى خدمات الموقع */

  const servicesSection =
    document.getElementById(
      "services-actions"
    );

  if (servicesSection) {

    servicesSection.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

  }

}


/* =========================================
   حماية النصوص
========================================= */

if (typeof escapeHTML !== "function") {

  window.escapeHTML = function(value) {

    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  };

}


if (typeof escapeJS !== "function") {

  window.escapeJS = function(value) {

    return String(value ?? "")
      .replace(/\\/g, "\\\\")
      .replace(/'/g, "\\'")
      .replace(/"/g, '\\"')
      .replace(/\r/g, "\\r")
      .replace(/\n/g, "\\n");

  };

      }
/* =========================================
   🌊 شمال المغرب
   فتح وإغلاق بطاقات خدمات الموقع
========================================= */

function toggleActionCard(card) {

  if (!card) return;

  document
    .querySelectorAll(
      "#services-actions .action-card"
    )
    .forEach(otherCard => {

      if (otherCard !== card) {
        otherCard.classList.remove(
          "card-open"
        );
      }

    });

  card.classList.toggle(
    "card-open"
  );
     }
/* =========================================
   حماية نماذج الخدمات من إغلاق البطاقة
========================================= */

document.addEventListener("click", function(event) {

  const form = event.target.closest(
    "#serviceRequestForm, #providerApplicationForm"
  );

  if (form) {
    event.stopPropagation();
  }

}, true);

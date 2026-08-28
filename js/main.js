/* =========================================
🌊 شمال المغرب
تشغيل الموقع + البحث
========================================= */

document.addEventListener(
"DOMContentLoaded",
function () {

/* =====================================
   الإقامات
===================================== */

if (typeof loadAccommodations === "function") {
  loadAccommodations();
}


/* =====================================
   المواصلات
===================================== */

if (typeof loadTransportServices === "function") {
  loadTransportServices();
}


/* =====================================
   الأنشطة والجولات
===================================== */

if (typeof loadActivities === "function") {
  loadActivities();
}


/* =====================================
   نموذج طلب الخدمة
===================================== */

const form =
  document.getElementById(
    "serviceRequestForm"
  );


if (
  form &&
  typeof submitServiceRequest === "function"
) {

  form.addEventListener(
    "submit",
    submitServiceRequest
  );

}


/* =====================================
   🔎 البحث
===================================== */

setupGlobalSearch();

}
);

/* =========================================
🔎 البحث العام
========================================= */

function setupGlobalSearch() {

const searchInput =
document.getElementById(
"globalSearch"
);

const searchMessage =
document.getElementById(
"searchMessage"
);

if (!searchInput) return;

searchInput.addEventListener(
"input",
function () {

  const query =
    String(this.value || "")
      .trim()
      .toLowerCase();


  const cards =
    document.querySelectorAll(
      ".accommodation-card"
    );


  let visibleCount = 0;


  /* إذا كان البحث فارغًا */

  if (!query) {

    cards.forEach(card => {

      card.style.display = "";

    });


    if (searchMessage) {

      searchMessage.textContent = "";

    }

    return;

  }


  /* البحث داخل البطاقات */

  cards.forEach(card => {

    const text =
      String(
        card.textContent || ""
      ).toLowerCase();


    if (
      text.includes(query)
    ) {

      card.style.display = "";

      visibleCount++;

    } else {

      card.style.display = "none";

    }

  });


  /* نتيجة البحث */

  if (searchMessage) {

    if (visibleCount > 0) {

      searchMessage.textContent =
        `🔎 تم العثور على ${visibleCount} خدمة.`;

    } else {

      searchMessage.textContent =
        "لم يتم العثور على نتائج مطابقة.";

    }

  }

}

);

}

/* =========================================
🔐 حماية HTML
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
🔐 حماية JavaScript
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
⚠️ رسالة الخطأ العامة
========================================= */

function showError(id) {

const container =
document.getElementById(id);

if (!container) return;

container.innerHTML = "<p class="empty"> تعذر تحميل البيانات حالياً. </p>";

       }

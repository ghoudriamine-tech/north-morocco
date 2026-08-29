/* =========================================
   🔎 شمال المغرب
   البحث في جميع الخدمات
========================================= */

function initGlobalSearch() {

  const searchInput =
    document.getElementById("globalSearch");

  const message =
    document.getElementById("searchMessage");

  if (!searchInput) return;

  searchInput.addEventListener("input", () => {

    const query =
      searchInput.value
        .trim()
        .toLowerCase();

    const cards =
      document.querySelectorAll(
        ".accommodation-card"
      );

    let found = 0;

    cards.forEach(card => {

      /*
       * لا نبحث داخل بطاقات
       * خدمات الموقع
       */
      if (
        card.closest("#services-actions")
      ) {
        return;
      }

      const text =
        card.textContent
          .toLowerCase();

      if (!query) {

        card.style.display = "";

        found++;

        return;
      }

      if (text.includes(query)) {

        card.style.display = "";

        found++;

      } else {

        card.style.display = "none";

      }

    });


    /* إظهار/إخفاء عناوين الأقسام */

    document
      .querySelectorAll(
        ".accommodation-category"
      )
      .forEach(category => {

        const visibleCards =
          category.querySelectorAll(
            ".accommodation-card:not([style*='display: none'])"
          );

        category.style.display =
          visibleCards.length
            ? ""
            : "none";

      });


    /* رسالة البحث */

    if (!query) {

      message.textContent = "";

      return;
    }


    if (found === 0) {

      message.textContent =
        "🔎 لم يتم العثور على خدمة مطابقة.";

    } else {

      message.textContent =
        `🔎 تم العثور على ${found} خدمة.`;

    }

  });

}


/* =========================================
   تشغيل البحث
========================================= */

document.addEventListener(
  "DOMContentLoaded",
  initGlobalSearch
);

/* =========================================
   🌊 شمال المغرب
   الإقامات
   البطاقة + التفاصيل المخفية
========================================= */


/* =========================================
   تحميل الإقامات
========================================= */

async function loadAccommodations() {

  try {

    const controller =
      new AbortController();

    const timeout =
      setTimeout(() => {
        controller.abort();
      }, 10000);


    const response =
      await fetch(
        `${SUPABASE_URL}/rest/v1/accommodations?select=*`,
        {
          method: "GET",
          headers: supabaseHeaders(),
          signal: controller.signal
        }
      );


    clearTimeout(timeout);


    if (!response.ok) {

      const errorText =
        await response.text();

      throw new Error(
        `HTTP ${response.status}: ${errorText}`
      );

    }


    const data =
      await response.json();


    console.log(
      "Accommodations data:",
      data
    );


    displayAccommodations(data);


  } catch (error) {

    console.error(
      "Accommodations error:",
      error
    );


    let message;


    if (
      error.name === "AbortError"
    ) {

      message =
        "انتهت مهلة تحميل الإقامات.";

    } else {

      message =
        `خطأ في تحميل الإقامات:<br>${escapeHTML(
          error.message || String(error)
        )}`;

    }


    [
      "apartmentsList",
      "hotelsList",
      "riadsList"
    ].forEach(id => {

      const container =
        document.getElementById(id);


      if (container) {

        container.innerHTML =
          `<p class="empty">${message}</p>`;

      }

    });

  }

}


/* =========================================
   تقسيم الإقامات
========================================= */

function displayAccommodations(data) {


  const apartments =
    data.filter(item =>
      isAccommodationType(
        item,
        [
          "شقق مفروشة",
          "شقة مفروشة",
          "apartment"
        ]
      )
    );


  const hotels =
    data.filter(item =>
      isAccommodationType(
        item,
        [
          "فنادق",
          "فندق",
          "hotel"
        ]
      )
    );


  const riads =
    data.filter(item =>
      isAccommodationType(
        item,
        [
          "رياضات",
          "رياض",
          "riad"
        ]
      )
    );


  displayAccommodationList(
    "apartmentsList",
    apartments,
    "لا توجد شقق مفروشة حالياً."
  );


  displayAccommodationList(
    "hotelsList",
    hotels,
    "لا توجد فنادق حالياً."
  );


  displayAccommodationList(
    "riadsList",
    riads,
    "لا توجد رياضات حالياً."
  );

}


/* =========================================
   التحقق من نوع الإقامة
========================================= */

function isAccommodationType(
  item,
  types
) {

  const value =
    String(
      item.type || ""
    )
      .trim()
      .toLowerCase();


  return types.some(type =>
    value ===
    String(type)
      .trim()
      .toLowerCase()
  );

}


/* =========================================
   عرض قائمة الإقامات
========================================= */

function displayAccommodationList(
  id,
  items,
  emptyMessage
) {

  const container =
    document.getElementById(id);


  if (!container) {
    return;
  }


  if (!items.length) {

    container.innerHTML =
      `<p class="empty">${emptyMessage}</p>`;

    return;

  }


  container.innerHTML =
    items.map(item => {


      const name =
        item.name ||
        "إقامة";


      const phone =
        item.phone
          ? String(item.phone).trim()
          : "";


      let whatsapp =
        item.whatsapp
          ? String(item.whatsapp)
              .replace(/\D/g, "")
          : phone.replace(/\D/g, "");


      if (
        whatsapp.startsWith("0")
      ) {

        whatsapp =
          "212" +
          whatsapp.substring(1);

      }


      /* ===============================
         الصورة
      =============================== */

      const image =
        item.image_url
          ? `
            <img
              src="${escapeHTML(item.image_url)}"
              alt="${escapeHTML(name)}"
              class="accommodation-image"
              loading="lazy">
          `
          : "";


      /* ===============================
         السعر
      =============================== */

      const price =
        item.price_per_night ??
        item.price ??
        "";


      /* ===============================
         الهاتف
      =============================== */

      const phoneButton =
        phone
          ? `
            <a
              href="tel:${escapeHTML(phone)}"
              class="btn icon-btn"
              aria-label="اتصال"
              title="اتصال">
              📞
            </a>
          `
          : "";


      /* ===============================
         واتساب
      =============================== */

      const whatsappButton =
        whatsapp
          ? `
            <a
              href="https://wa.me/${whatsapp}"
              class="btn whatsapp-accommodation icon-btn"
              target="_blank"
              rel="noopener"
              aria-label="واتساب"
              title="واتساب">
              💬
            </a>
          `
          : "";


      /* ===============================
         الموقع
      =============================== */

      const mapButton =
        item.map_url
          ? `
            <a
              href="${escapeHTML(item.map_url)}"
              class="btn icon-btn"
              target="_blank"
              rel="noopener"
              aria-label="الموقع"
              title="الموقع">
              📍
            </a>
          `
          : "";


      /* ===============================
         طلب الخدمة
      =============================== */

      const requestButton = `
        <button
          type="button"
          class="btn request-btn"
          aria-label="طلب الخدمة"
          title="طلب الخدمة"
          onclick="
            event.stopPropagation();

            selectService(
              'accommodation',
              '${escapeJS(item.id)}',
              '${escapeJS(name)}'
            );
          "
        >
          📋
        </button>
      `;


      /* ===============================
         البطاقة
      =============================== */

      return `

        <div
          class="accommodation-card service-card"
          onclick="toggleAccommodationCard(this)"
        >

          ${image}


          <h3>
            ${escapeHTML(name)}
          </h3>


          ${
            item.city
              ? `
                <p>
                  📍 ${escapeHTML(item.city)}
                </p>
              `
              : ""
          }


          ${
            item.address
              ? `
                <p>
                  📌 ${escapeHTML(item.address)}
                </p>
              `
              : ""
          }


          ${
            item.description
              ? `
                <p>
                  ${escapeHTML(item.description)}
                </p>
              `
              : ""
          }


          ${
            price !== ""
              ? `
                <p>
                  💰 ${escapeHTML(price)}
                  درهم / ليلة
                </p>
              `
              : ""
          }


          <!-- =========================
               التفاصيل المخفية
          ========================== -->

          <div
            class="service-card-details"
            onclick="event.stopPropagation()"
          >

            <div class="accommodation-buttons">

              ${phoneButton}

              ${whatsappButton}

              ${mapButton}

              ${requestButton}

            </div>


            <!-- التقييم مخفي -->

            <div class="reviews-hidden-area">

              ${renderReviews(
                "accommodation",
                item.id
              )}

            </div>


          </div>

        </div>

      `;

    }).join("");

}


/* =========================================
   فتح وإغلاق بطاقة الإقامة
========================================= */

function toggleAccommodationCard(card) {

  if (!card) {
    return;
  }


  /* إغلاق البطاقات الأخرى */

  document
    .querySelectorAll(
      ".service-card.service-card-open"
    )
    .forEach(openCard => {

      if (openCard !== card) {

        openCard.classList.remove(
          "service-card-open"
        );

      }

    });


  /* فتح / إغلاق البطاقة */

  card.classList.toggle(
    "service-card-open"
  );

}


/* =========================================
   تشغيل الإقامات
========================================= */

document.addEventListener(
  "DOMContentLoaded",
  function () {

    loadAccommodations();

  }
);


/* =========================================
   نهاية accommodations.js
========================================= */

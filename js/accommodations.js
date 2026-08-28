console.log("ACCOMMODATIONS.JS LOADED");/* =========================================
   🌊 شمال المغرب
   الإقامات
   النسخة المستقرة
========================================= */

async function loadAccommodations() {

  const lists = [
    "apartmentsList",
    "hotelsList",
    "riadsList"
  ];

  try {

    const controller = new AbortController();

    const timeout = setTimeout(() => {
      controller.abort();
    }, 10000);


    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/accommodations?select=*`,
      {
        method: "GET",

        headers: {
          "apikey": SUPABASE_KEY,
          "Authorization": `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json"
        },

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


    displayAccommodations(
      Array.isArray(data) ? data : []
    );


  } catch (error) {

    console.error(
      "Accommodations error:",
      error
    );


    const message =
      error.name === "AbortError"
        ? "انتهت مهلة تحميل الإقامات."
        : "تعذر تحميل الإقامات حالياً.";


    lists.forEach(id => {

      const box =
        document.getElementById(id);

      if (box) {

        box.innerHTML =
          `<p class="empty">${message}</p>`;

      }

    });

  }

}


/* =========================================
   عرض الإقامات
========================================= */

function displayAccommodations(data) {

  displayAccommodationList(
    "apartmentsList",

    data.filter(item =>
      isAccommodationType(
        item,
        [
          "شقق مفروشة",
          "شقة مفروشة",
          "apartment"
        ]
      )
    ),

    "لا توجد شقق مفروشة حالياً."
  );


  displayAccommodationList(
    "hotelsList",

    data.filter(item =>
      isAccommodationType(
        item,
        [
          "فنادق",
          "فندق",
          "hotel"
        ]
      )
    ),

    "لا توجد فنادق حالياً."
  );


  displayAccommodationList(
    "riadsList",

    data.filter(item =>
      isAccommodationType(
        item,
        [
          "رياضات",
          "رياض",
          "riad"
        ]
      )
    ),

    "لا توجد رياضات حالياً."
  );

}


/* =========================================
   التحقق من نوع الإقامة
========================================= */

function isAccommodationType(item, types) {

  const value =
    String(item?.type || "")
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
   عرض قائمة
========================================= */

function displayAccommodationList(
  id,
  items,
  emptyMessage
) {

  const box =
    document.getElementById(id);


  if (!box) return;


  if (!items.length) {

    box.innerHTML =
      `<p class="empty">${emptyMessage}</p>`;

    return;

  }


  box.innerHTML =
    items
      .map(accommodationCard)
      .join("");

}


/* =========================================
   بطاقة الإقامة
========================================= */

function accommodationCard(item) {

  const id =
    item.id;


  const name =
    item.name || "إقامة";


  const phone =
    String(item.phone || "").trim();


  let whatsapp =
    String(
      item.whatsapp || phone
    )
    .replace(/\D/g, "");


  if (whatsapp.startsWith("0")) {

    whatsapp =
      "212" +
      whatsapp.substring(1);

  }


  const price =
    item.price_per_night ??
    item.price ??
    "";


  return `

    <div
      class="accommodation-card service-card"
      onclick="toggleAccommodationCard(this)"
    >

      ${
        item.image_url
          ? `
            <img
              src="${escapeHTML(item.image_url)}"
              alt="${escapeHTML(name)}"
              class="accommodation-image"
              loading="lazy"
            >
          `
          : ""
      }


      <h3>
        ${escapeHTML(name)}
      </h3>


      ${
        item.city
          ? `<p>📍 ${escapeHTML(item.city)}</p>`
          : ""
      }


      ${
        item.address
          ? `<p>📌 ${escapeHTML(item.address)}</p>`
          : ""
      }


      ${
        item.description
          ? `<p>${escapeHTML(item.description)}</p>`
          : ""
      }


      ${
        price !== ""
          ? `<p>💰 ${escapeHTML(price)} درهم / ليلة</p>`
          : ""
      }


      <div
        class="service-card-details"
        onclick="event.stopPropagation()"
      >

        <div class="accommodation-buttons">


          ${
            phone
              ? `
                <a
                  href="tel:${escapeHTML(phone)}"
                  class="btn icon-btn"
                  aria-label="اتصال"
                  title="اتصال"
                >
                  📞
                </a>
              `
              : ""
          }


          ${
            whatsapp
              ? `
                <a
                  href="https://wa.me/${whatsapp}"
                  class="btn whatsapp-accommodation icon-btn"
                  target="_blank"
                  rel="noopener"
                  aria-label="واتساب"
                  title="واتساب"
                >
                  💬
                </a>
              `
              : ""
          }


          ${
            item.map_url
              ? `
                <a
                  href="${escapeHTML(item.map_url)}"
                  class="btn icon-btn"
                  target="_blank"
                  rel="noopener"
                  aria-label="الموقع"
                  title="الموقع"
                >
                  📍
                </a>
              `
              : ""
          }


          <button
            type="button"
            class="btn request-btn"
            onclick="
              event.stopPropagation();
              selectService(
                'accommodation',
                '${escapeJS(id)}',
                '${escapeJS(name)}'
              );
            "
            aria-label="طلب الخدمة"
            title="طلب الخدمة"
          >
            📋
          </button>

        </div>


        <div class="reviews-hidden-area">

          ${
            typeof renderReviews === "function"
              ? renderReviews(
                  "accommodation",
                  id
                )
              : ""
          }

        </div>

      </div>

    </div>

  `;

}


/* =========================================
   فتح / إغلاق بطاقة الإقامة
========================================= */

function toggleAccommodationCard(card) {

  if (!card) return;


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


  card.classList.toggle(
    "service-card-open"
  );

}

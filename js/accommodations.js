/* =========================================
   🌊 شمال المغرب
   الإقامات
========================================= */

async function loadAccommodations() {

  const lists = [
    "apartmentsList",
    "hotelsList",
    "riadsList"
  ];

  try {

    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/accommodations?select=*`,
      {
        method: "GET",
        headers: supabaseHeaders()
      }
    );

    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status}`
      );
    }

    const data = await response.json();

    displayAccommodations(
      Array.isArray(data) ? data : []
    );

  } catch (error) {

    console.error(
      "Accommodations error:",
      error
    );

    lists.forEach(id => {

      const box =
        document.getElementById(id);

      if (box) {
        box.innerHTML =
          '<p class="empty">تعذر تحميل البيانات حالياً.</p>';
      }

    });
  }
}


/* =========================================
   عرض الإقامات
========================================= */

function displayAccommodations(data) {

  displayList(
    "apartmentsList",
    data,
    ["شقق مفروشة", "شقة مفروشة", "apartment"],
    "لا توجد شقق مفروشة حالياً."
  );

  displayList(
    "hotelsList",
    data,
    ["فنادق", "فندق", "hotel"],
    "لا توجد فنادق حالياً."
  );

  displayList(
    "riadsList",
    data,
    ["رياضات", "رياض", "riad"],
    "لا توجد رياضات حالياً."
  );
}


/* =========================================
   فلترة النوع
========================================= */

function displayList(id, data, types, emptyMessage) {

  const box =
    document.getElementById(id);

  if (!box) return;

  const items =
    data.filter(item => {

      const type =
        String(item.type || "")
          .trim()
          .toLowerCase();

      return types.some(t =>
        type === t.toLowerCase()
      );

    });

  if (!items.length) {

    box.innerHTML =
      `<p class="empty">${emptyMessage}</p>`;

    return;
  }

  box.innerHTML =
    items.map(accommodationCard).join("");
}


/* =========================================
   بطاقة الإقامة
========================================= */

function accommodationCard(item) {

  const name =
    item.name || "إقامة";

  const phone =
    String(item.phone || "").trim();

  let wa =
    String(item.whatsapp || phone)
      .replace(/\D/g, "");

  if (wa.startsWith("0")) {
    wa = "212" + wa.slice(1);
  }

  const price =
    item.price_per_night ??
    item.price ??
    "";

  return `
    <div class="accommodation-card">

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

      <div class="accommodation-buttons">

        ${
          phone
            ? `<a class="btn" href="tel:${escapeHTML(phone)}">📞</a>`
            : ""
        }

        ${
          wa
            ? `
              <a
                class="btn whatsapp-accommodation"
                href="https://wa.me/${wa}"
                target="_blank"
                rel="noopener"
              >💬</a>
            `
            : ""
        }

        ${
          item.map_url
            ? `
              <a
                class="btn"
                href="${escapeHTML(item.map_url)}"
                target="_blank"
                rel="noopener"
              >📍</a>
            `
            : ""
        }

      </div>

    </div>
  `;
     }

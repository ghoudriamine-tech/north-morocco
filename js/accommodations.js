async function loadAccommodations() async function loadAccommodations() {

  try {

    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/accommodations?select=*`,
      {
        method: "GET",
        headers: supabaseHeaders()
      }
    );

    if (!response.ok) {

      const errorText = await response.text();

      console.error(
        "Accommodations HTTP error:",
        response.status,
        errorText
      );

      const message =
        `خطأ في تحميل الإقامات<br>
        HTTP ${response.status}<br>
        ${escapeHTML(errorText)}`;

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

      return;
    }

    const data = await response.json();

    console.log("Accommodations data:", data);

    displayAccommodations(data);

  } catch (error) {

    console.error(
      "Accommodations error:",
      error
    );

    const message =
      `حدث خطأ أثناء تحميل الإقامات:<br>
      ${escapeHTML(error.message || String(error))}`;

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

function displayAccommodations(data) {

  const apartments = data.filter(item =>
    ["شقق مفروشة", "شقة مفروشة", "apartment"]
      .includes(
        String(item.type || "")
          .trim()
          .toLowerCase()
      )
  );

  const hotels = data.filter(item =>
    ["فنادق", "فندق", "hotel"]
      .includes(
        String(item.type || "")
          .trim()
          .toLowerCase()
      )
  );

  const riads = data.filter(item =>
    ["رياضات", "رياض", "riad"]
      .includes(
        String(item.type || "")
          .trim()
          .toLowerCase()
      )
  );

  displayList(
    "apartmentsList",
    apartments,
    "لا توجد شقق مفروشة حالياً."
  );

  displayList(
    "hotelsList",
    hotels,
    "لا توجد فنادق حالياً."
  );

  displayList(
    "riadsList",
    riads,
    "لا توجد رياضات حالياً."
  );
}


function displayList(id, items, emptyMessage) {

  const container =
    document.getElementById(id);

  if (!container) return;

  if (!items.length) {

    container.innerHTML =
      `<p class="empty">${emptyMessage}</p>`;

    return;
  }

  container.innerHTML = items.map(item => {

    const phone =
      item.phone
        ? String(item.phone).trim()
        : "";

    let whatsapp =
      item.whatsapp
        ? String(item.whatsapp).replace(/\D/g, "")
        : phone.replace(/\D/g, "");

    if (whatsapp.startsWith("0")) {
      whatsapp =
        "212" + whatsapp.substring(1);
    }

    const image =
      item.image_url
        ? `
          <img
            src="${escapeHTML(item.image_url)}"
            alt="${escapeHTML(item.name || "صورة الإقامة")}"
            class="accommodation-image"
            loading="lazy">
        `
        : "";

    const price =
      item.price_per_night ??
      item.price ??
      "";

    const phoneButton =
      phone
        ? `
          <a
            href="tel:${escapeHTML(phone)}"
            class="btn">
            📞 اتصال
          </a>
        `
        : "";

    const whatsappButton =
      whatsapp
        ? `
          <a
            href="https://wa.me/${whatsapp}"
            class="btn whatsapp-accommodation"
            target="_blank"
            rel="noopener">
            💬 واتساب
          </a>
        `
        : "";

    const mapButton =
      item.map_url
        ? `
          <a
            href="${escapeHTML(item.map_url)}"
            class="btn"
            target="_blank"
            rel="noopener">
            📍 الموقع
          </a>
        `
        : "";

    const requestButton = `
      <button
        type="button"
        class="btn"
        onclick="selectService(
          'accommodation',
          '${escapeJS(item.id)}',
          '${escapeJS(item.name || "إقامة")}'
        )">
        📋 اطلب هذه الخدمة
      </button>
    `;

    return `
      <div class="accommodation-card">

        ${image}

        <h3>
          ${escapeHTML(item.name || "إقامة")}
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

          ${phoneButton}
          ${whatsappButton}
          ${mapButton}
          ${requestButton}

        </div>

      </div>
    `;

  }).join("");
}

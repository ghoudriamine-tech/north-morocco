 /* =========================================
   🌊 شمال المغرب
   المواصلات
========================================= */

async function loadTransportServices() {
  const lists = [
    "carRentalList",
    "taxiList",
    "busList"
  ];

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/transport_services?select=*`,
      {
        headers: supabaseHeaders(),
        signal: controller.signal
      }
    );

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status}: ${await response.text()}`
      );
    }

    const data = await response.json();

    displayTransportServices(
      Array.isArray(data) ? data : []
    );

  } catch (error) {
    console.error("Transport error:", error);

    const message =
      error.name === "AbortError"
        ? "انتهت مهلة تحميل خدمات المواصلات."
        : `خطأ في تحميل المواصلات:<br>${escapeHTML(
            error.message || String(error)
          )}`;

    lists.forEach(id => {
      const box = document.getElementById(id);
      if (box)
        box.innerHTML = `<p class="empty">${message}</p>`;
    });
  }
}


function displayTransportServices(data) {
  displayTransportList(
    "carRentalList",
    data.filter(x =>
      isTransportType(x, [
        "car_rental",
        "car rental",
        "كراء السيارات",
        "تأجير السيارات",
        "سيارات للكراء"
      ])
    ),
    "لا توجد خدمات كراء السيارات حالياً."
  );

  displayTransportList(
    "taxiList",
    data.filter(x =>
      isTransportType(x, [
        "taxi",
        "سيارات الأجرة",
        "سيارة أجرة",
        "taxi service"
      ])
    ),
    "لا توجد خدمات سيارات الأجرة حالياً."
  );

  displayTransportList(
    "busList",
    data.filter(x =>
      isTransportType(x, [
        "bus",
        "tourist_bus",
        "tourist bus",
        "حافلات",
        "حافلات سياحية صغيرة",
        "الحافلات السياحية الصغيرة"
      ])
    ),
    "لا توجد خدمات الحافلات السياحية حالياً."
  );
}


function isTransportType(item, types) {
  const values = [
    item?.service_type,
    item?.type,
    item?.category,
    item?.transport_type
  ];

  return values.some(value => {
    if (!value) return false;

    const normalized =
      String(value).trim().toLowerCase();

    return types.some(type =>
      normalized ===
      String(type).trim().toLowerCase()
    );
  });
}


function displayTransportList(
  id,
  items,
  emptyMessage
) {
  const box = document.getElementById(id);

  if (!box) return;

  if (!items.length) {
    box.innerHTML =
      `<p class="empty">${emptyMessage}</p>`;
    return;
  }

  box.innerHTML = items
    .map(transportCard)
    .join("");
}


function transportCard(item) {
  const id = item.id;
  const name =
    item.name ||
    item.title ||
    "خدمة نقل";

  const phone =
    String(item.phone || "").trim();

  let whatsapp =
    String(item.whatsapp || phone)
      .replace(/\D/g, "");

  if (whatsapp.startsWith("0")) {
    whatsapp =
      "212" + whatsapp.substring(1);
  }

  return `
    <div class="accommodation-card service-card">

      ${
        item.image_url
          ? `
            <img
              src="${escapeHTML(item.image_url)}"
              alt="${escapeHTML(name)}"
              class="accommodation-image"
              loading="lazy">
          `
          : ""
      }

      <h3>${escapeHTML(name)}</h3>

      ${
        item.city
          ? `<p>📍 ${escapeHTML(item.city)}</p>`
          : ""
      }

      ${
        item.description
          ? `<p>${escapeHTML(item.description)}</p>`
          : ""
      }

      <div class="accommodation-buttons">

        ${
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
                title="واتساب">
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
                title="الموقع">
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
              'transport',
              '${escapeJS(id)}',
              '${escapeJS(name)}'
            );
          "
          aria-label="طلب الخدمة"
          title="طلب الخدمة">
          📋
        </button>

      </div>

      ${
        typeof renderReviews === "function"
          ? renderReviews("transport", id)
          : ""
      }

    </div>
  `;
    }

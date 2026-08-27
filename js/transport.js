async function loadTransportServices() {

  try {

    const controller = new AbortController();

    const timeout = setTimeout(() => {
      controller.abort();
    }, 10000);

    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/transport_services?select=*`,
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
      "Transport data:",
      data
    );

    displayTransportServices(data);

  } catch (error) {

    console.error(
      "Transport error:",
      error
    );

    let message;

    if (error.name === "AbortError") {

      message =
        "انتهت مهلة تحميل خدمات المواصلات. لم يستجب الخادم خلال 10 ثوانٍ.";

    } else {

      message =
        `خطأ في تحميل المواصلات:<br>${escapeHTML(
          error.message || String(error)
        )}`;

    }

    [
      "carRentalList",
      "taxiList",
      "busList"
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


function displayTransportServices(data) {

  const cars = data.filter(item =>
    isTransportType(item, [
      "car_rental",
      "car rental",
      "كراء السيارات",
      "تأجير السيارات",
      "سيارات للكراء"
    ])
  );

  const taxis = data.filter(item =>
    isTransportType(item, [
      "taxi",
      "سيارات الأجرة",
      "سيارة أجرة",
      "taxi service"
    ])
  );

  const buses = data.filter(item =>
    isTransportType(item, [
      "bus",
      "tourist_bus",
      "tourist bus",
      "حافلات",
      "حافلات سياحية صغيرة",
      "الحافلات السياحية الصغيرة"
    ])
  );

  displayTransportList(
    "carRentalList",
    cars,
    "لا توجد خدمات كراء السيارات حالياً."
  );

  displayTransportList(
    "taxiList",
    taxis,
    "لا توجد خدمات سيارات الأجرة حالياً."
  );

  displayTransportList(
    "busList",
    buses,
    "لا توجد خدمات الحافلات السياحية حالياً."
  );

}


function isTransportType(item, types) {

  const values = [
    item.service_type,
    item.type,
    item.category,
    item.transport_type
  ];

  return values.some(value => {

    if (!value) return false;

    const normalized =
      String(value)
        .trim()
        .toLowerCase();

    return types.some(type =>
      normalized ===
      String(type)
        .trim()
        .toLowerCase()
    );

  });

}


function displayTransportList(
  id,
  items,
  emptyMessage
) {

  const container =
    document.getElementById(id);

  if (!container) return;

  if (!items.length) {

    container.innerHTML =
      `<p class="empty">${emptyMessage}</p>`;

    return;

  }

  container.innerHTML = items.map(item => {

    const name =
      item.name ||
      item.title ||
      "خدمة نقل";

    const description =
      item.description || "";

    const city =
      item.city || "";

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
            alt="${escapeHTML(name)}"
            class="accommodation-image"
            loading="lazy">
        `
        : "";

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

    const requestButton = `
      <button
        type="button"
        class="btn"
        onclick="selectService(
          'transport',
          '${escapeJS(item.id)}',
          '${escapeJS(name)}'
        )">
        📋 اطلب هذه الخدمة
      </button>
    `;

    return `
      <div class="accommodation-card">

        ${image}

        <h3>
          ${escapeHTML(name)}
        </h3>

        ${
          city
            ? `<p>📍 ${escapeHTML(city)}</p>`
            : ""
        }

        ${
          description
            ? `<p>${escapeHTML(description)}</p>`
            : ""
        }

        <div class="accommodation-buttons">

          ${phoneButton}

          ${whatsappButton}

          ${requestButton}

        </div>

        ${renderReviews(
          "transport",
          item.id
        )}

      </div>
    `;

  }).join("");

}

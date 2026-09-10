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

    /* تحميل الصور */
    const imagesResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/transport_images?select=transport_id,image_url&order=id.asc`,
      {
        headers: supabaseHeaders(),
        signal: controller.signal
      }
    );

    if (!imagesResponse.ok) {
      throw new Error(
        `HTTP ${imagesResponse.status}: ${await imagesResponse.text()}`
      );
    }

    const imagesData = await imagesResponse.json();

    const imagesByTransport = {};

    (Array.isArray(imagesData) ? imagesData : [])
      .forEach(image => {
        const transportId = image.transport_id;

        if (!imagesByTransport[transportId]) {
          imagesByTransport[transportId] = [];
        }

        if (image.image_url) {
          imagesByTransport[transportId].push(
            image.image_url
          );
        }
      });

    const services = (
      Array.isArray(data) ? data : []
    ).map(item => ({
      ...item,
      images:
        imagesByTransport[item.id] || []
    }));

    displayTransportServices(services);

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

      if (box) {
        box.innerHTML =
          `<p class="empty">${message}</p>`;
      }
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

  let images = Array.isArray(item.images)
    ? item.images.filter(Boolean)
    : [];

  if (!images.length && item.image_url) {
    images = [item.image_url];
  }

  const imageId =
    `transport-images-${id}`;

  return `
    <div class="accommodation-card service-card">

      ${
        images.length
          ? `
            <div
              class="transport-image-slider"
              id="${imageId}">

              <img
                src="${escapeHTML(images[0])}"
                alt="${escapeHTML(name)}"
                class="accommodation-image transport-main-image"
                loading="lazy">

              ${
                images.length > 1
                  ? `
                    <button
                      type="button"
                      class="transport-image-arrow transport-prev"
                      onclick="changeTransportImage('${escapeJS(imageId)}', -1)"
                      aria-label="الصورة السابقة">
                      ❮
                    </button>

                    <button
                      type="button"
                      class="transport-image-arrow transport-next"
                      onclick="changeTransportImage('${escapeJS(imageId)}', 1)"
                      aria-label="الصورة التالية">
                      ❯
                    </button>

                    <span
                      class="transport-image-counter">
                      1 / ${images.length}
                    </span>
                  `
                  : ""
              }

            </div>
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

      ${
        item.price !== null &&
        item.price !== undefined &&
        String(item.price).trim() !== ""
          ? `<p>💰 ${escapeHTML(String(item.price))} درهم</p>`
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


/* =========================================
   تبديل صور المواصلات
========================================= */

window.transportImageIndexes =
  window.transportImageIndexes || {};


window.transportImages =
  window.transportImages || {};


function changeTransportImage(
  imageId,
  direction
) {
  const slider =
    document.getElementById(imageId);

  if (!slider) return;

  const image =
    slider.querySelector(
      ".transport-main-image"
    );

  const counter =
    slider.querySelector(
      ".transport-image-counter"
    );

  if (!image) return;

  /*
     نقرأ الصور من العنصر نفسه
     الذي تم إنشاؤه بواسطة البطاقة
  */
  const images =
    window.transportImages[imageId];

  if (!images || !images.length) return;

  let current =
    window.transportImageIndexes[imageId] || 0;

  current += direction;

  if (current < 0) {
    current = images.length - 1;
  }

  if (current >= images.length) {
    current = 0;
  }

  window.transportImageIndexes[imageId] =
    current;

  image.src =
    images[current];

  if (counter) {
    counter.textContent =
      `${current + 1} / ${images.length}`;
  }
}


/* =========================================
   حفظ صور كل بطاقة بعد إنشائها
========================================= */

const originalTransportCard =
  transportCard;


/*
   إعادة إنشاء الصور بطريقة آمنة
*/
function prepareTransportImages(data) {
  data.forEach(item => {
    const images =
      Array.isArray(item.images)
        ? item.images.filter(Boolean)
        : [];

    if (!images.length && item.image_url) {
      images.push(item.image_url);
    }

    window.transportImages[
      `transport-images-${item.id}`
    ] = images;
  });
}


/*
   تعديل displayTransportServices
   لحفظ الصور قبل إنشاء البطاقات
*/
const originalDisplayTransportServices =
  displayTransportServices;

displayTransportServices = function(data) {
  prepareTransportImages(data);

  originalDisplayTransportServices(data);
};

/* =========================================
   🗺️ شمال المغرب
   الرحلات والمرشدون السياحيون
========================================= */

async function loadActivities() {
  const lists = ["tripsList", "guidesList"];

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/activities?select=*`,
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
    displayActivities(Array.isArray(data) ? data : []);

  } catch (error) {
    console.error("Activities error:", error);

    const message =
      error.name === "AbortError"
        ? "انتهت مهلة تحميل الأنشطة والجولات."
        : `خطأ في تحميل الأنشطة والجولات:<br>${escapeHTML(
            error.message || String(error)
          )}`;

    lists.forEach(id => {
      const box = document.getElementById(id);
      if (box)
        box.innerHTML = `<p class="empty">${message}</p>`;
    });
  }
}


function displayActivities(data) {
  displayActivityList(
    "tripsList",
    data.filter(x => isActivityType(x, "trip")),
    "لا توجد رحلات حالياً."
  );

  displayActivityList(
    "guidesList",
    data.filter(x => isActivityType(x, "tour_guide")),
    "لا يوجد مرشدون سياحيون حالياً."
  );
}


function isActivityType(item, type) {
  return String(item?.activity_type || "")
    .trim()
    .toLowerCase() ===
    String(type).trim().toLowerCase();
}


function displayActivityList(
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
    .map(activityCard)
    .join("");
}


function activityCard(item) {
  const id = item.id;
  const name = item.name || "خدمة سياحية";
  const phone = String(item.phone || "").trim();

  let whatsapp =
    String(item.whatsapp || phone)
      .replace(/\D/g, "");

  if (whatsapp.startsWith("0")) {
    whatsapp =
      "212" + whatsapp.substring(1);
  }

  return `
    <div
      class="accommodation-card activity-card"
      onclick="toggleActivityCard(this)"
    >

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
        item.price !== null &&
        item.price !== undefined &&
        item.price !== ""
          ? `<p>💰 ${escapeHTML(item.price)} درهم</p>`
          : ""
      }

      <div
        class="activity-card-details"
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
                'activity',
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
            ? renderReviews("activity", id)
            : ""
        }

      </div>

    </div>
  `;
}


function toggleActivityCard(card) {
  if (!card) return;

  document
    .querySelectorAll(".activity-card.activity-card-open")
    .forEach(openCard => {
      if (openCard !== card) {
        openCard.classList.remove(
          "activity-card-open"
        );
      }
    });

  card.classList.toggle(
    "activity-card-open"
  );
}

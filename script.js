const SUPABASE_URL =
  "https://rbmttbxsezttysenbcwn.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_tVChEdNRQHs9lrYPjA4ajQ_heTXT2x2";


async function loadAccommodations() {

  const headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": `Bearer ${SUPABASE_KEY}`
  };

  try {

    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/accommodations?select=*`,
      {
        method: "GET",
        headers: headers
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    console.log("Supabase data:", data);

    displayAccommodations(data);

  } catch (error) {

    console.error("Supabase error:", error);

    showError("apartmentsList");
    showError("hotelsList");
    showError("riadsList");
  }
}


/* =========================
   تصنيف الإقامات
========================= */

function displayAccommodations(data) {

  const apartments = data.filter(item =>
    item.type === "شقق مفروشة" ||
    item.type === "شقة مفروشة"
  );

  const hotels = data.filter(item =>
    item.type === "فنادق" ||
    item.type === "فندق"
  );

  const riads = data.filter(item =>
    item.type === "رياضات" ||
    item.type === "رياض" ||
    item.type === "Riad"
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


/* =========================
   عرض البطاقات
========================= */

function displayList(id, items, emptyMessage) {

  const container =
    document.getElementById(id);

  if (!container) return;


  if (items.length === 0) {

    container.innerHTML =
      `<p class="empty">${emptyMessage}</p>`;

    return;
  }


  container.innerHTML =
    items.map(item => {

      /* الهاتف */

      const phone =
        item.phone
          ? String(item.phone).replace(/\D/g, "")
          : "";


      /* واتساب */

      let whatsappNumber = "";

      if (item.whatsapp) {

        whatsappNumber =
          String(item.whatsapp)
            .replace(/\D/g, "");

      } else if (phone) {

        whatsappNumber = phone;

      }


      if (whatsappNumber.startsWith("0")) {

        whatsappNumber =
          "212" +
          whatsappNumber.substring(1);

      }


      return `

        <div class="accommodation-card">


          ${
            item.image_url
              ? `
                <img
                  src="${escapeHTML(item.image_url)}"
                  alt="${escapeHTML(
                    item.name || "صورة الإقامة"
                  )}"
                  class="accommodation-image"
                  loading="lazy"
                  onerror="
                    this.style.display='none'
                  "
                >
              `
              : ""
          }


          <h3>
            ${escapeHTML(
              item.name || "إقامة"
            )}
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
            item.price_per_night
              ? `
                <p>
                  💰
                  ${escapeHTML(
                    String(
                      item.price_per_night
                    )
                  )}
                  درهم / ليلة
                </p>
              `
              : ""
          }


          <div class="accommodation-buttons">


            ${
              item.phone
                ? `
                  <a
                    href="tel:${escapeHTML(
                      item.phone
                    )}"
                    class="btn">

                    📞 اتصال

                  </a>
                `
                : ""
            }


            ${
              whatsappNumber
                ? `
                  <a
                    href="https://wa.me/${whatsappNumber}"
                    class="btn whatsapp-accommodation"
                    target="_blank"
                    rel="noopener">

                    💬 واتساب

                  </a>
                `
                : ""
            }


            ${
              item.map_url
                ? `
                  <a
                    href="${escapeHTML(
                      item.map_url
                    )}"
                    class="btn"
                    target="_blank"
                    rel="noopener">

                    📍 الموقع

                  </a>
                `
                : ""
            }


          </div>


        </div>

      `;

    }).join("");
}


/* =========================
   رسالة الخطأ
========================= */

function showError(id) {

  const container =
    document.getElementById(id);

  if (!container) return;


  container.innerHTML =
    `
      <p class="empty">
        تعذر تحميل البيانات حالياً.
      </p>
    `;
}


/* =========================
   حماية النصوص
========================= */

function escapeHTML(value) {

  return String(value)

    .replace(/&/g, "&amp;")

    .replace(/</g, "&lt;")

    .replace(/>/g, "&gt;")

    .replace(
      /"/g,
      "&quot;"
    )

    .replace(
      /'/g,
      "&#039;"
    );
}


/* =========================
   تشغيل الموقع
========================= */

document.addEventListener(
  "DOMContentLoaded",
  loadAccommodations
);

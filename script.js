const SUPABASE_URL =
  "https://rbmttbxsezttysenbcwn.supabase.co/rest/v1/://.";

const SUPABASE_KEY =
  "";
sb_publishable_tVChEdNRQHs9lrYPjA4ajQ_heTXT2xw
const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

async function loadAccommodations() {

  const apartmentsList =
    document.getElementById("apartmentsList");

  const hotelsList =
    document.getElementById("hotelsList");

  const riadsList =
    document.getElementById("riadsList");

  try {

    const result =
      await supabaseClient
        .from("accommodations")
        .select("*")
        .order("id", {
          ascending: false
        });

    if (result.error) {
      throw result.error;
    }

    const data = result.data || [];

    const apartments = data.filter(item =>
      item.type === "شقق مفروشة"
    );

    const hotels = data.filter(item =>
      item.type === "فنادق" ||
      item.type === "Hotel"
    );

    const riads = data.filter(item =>
      item.type === "رياضات" ||
      item.type === "Riad"
    );

    showAccommodations(
      apartmentsList,
      apartments,
      "لا توجد شقق مفروشة حالياً."
    );

    showAccommodations(
      hotelsList,
      hotels,
      "لا توجد فنادق حالياً."
    );

    showAccommodations(
      riadsList,
      riads,
      "لا توجد رياضات حالياً."
    );

  } catch (error) {

    console.error(
      "Supabase error:",
      error
    );

    showError(apartmentsList);
    showError(hotelsList);
    showError(riadsList);
  }
}


function showAccommodations(
  container,
  accommodations,
  emptyMessage
) {

  if (!container) return;

  if (accommodations.length === 0) {

    container.innerHTML =
      `<p class="empty">${emptyMessage}</p>`;

    return;
  }

  container.innerHTML =
    accommodations.map(item => {

      return `
        <div class="accommodation-card">

          <h3>
            ${escapeHTML(
              item.name || "إقامة"
            )}
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
            item.price
              ? `<p>💰 ${escapeHTML(
                  String(item.price)
                )} درهم</p>`
              : ""
          }

          ${
            item.price_per_night
              ? `<p>💰 ${escapeHTML(
                  String(item.price_per_night)
                )} درهم / ليلة</p>`
              : ""
          }

          ${
            item.phone
              ? `
                <a
                  href="tel:${escapeHTML(item.phone)}"
                  class="btn">
                  📞 اتصال
                </a>
              `
              : ""
          }

        </div>
      `;

    }).join("");
}


function showError(container) {

  if (!container) return;

  container.innerHTML =
    `<p class="empty">
      تعذر تحميل البيانات حالياً.
    </p>`;
}


function escapeHTML(value) {

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


document.addEventListener(
  "DOMContentLoaded",
  loadAccommodations
);

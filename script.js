const SUPABASE_URL =
  "ضع_API_URL_الحالي_هنا";

const SUPABASE_KEY =
  "ضع_Publishable_Key_الحالي_هنا";

const supabaseClient =
  supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );


async function testConnection() {

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
        .select("*");

    console.log("SUPABASE RESULT:", result);

    if (result.error) {
      throw result.error;
    }

    const data = result.data || [];

    console.log(
      "عدد الإقامات:",
      data.length
    );

    const apartments =
      data.filter(item =>
        item.type === "شقق مفروشة"
      );

    const hotels =
      data.filter(item =>
        item.type === "فنادق" ||
        item.type === "Hotel"
      );

    const riads =
      data.filter(item =>
        item.type === "رياضات" ||
        item.type === "Riad"
      );

    show(
      apartmentsList,
      apartments,
      "لا توجد شقق مفروشة."
    );

    show(
      hotelsList,
      hotels,
      "لا توجد فنادق."
    );

    show(
      riadsList,
      riads,
      "لا توجد رياضات."
    );

  } catch (error) {

    console.error(
      "SUPABASE ERROR:",
      error
    );

    showError(
      apartmentsList,
      error.message
    );

    showError(
      hotelsList,
      error.message
    );

    showError(
      riadsList,
      error.message
    );
  }
}


function show(
  container,
  items,
  emptyMessage
) {

  if (!container) return;

  if (!items.length) {

    container.innerHTML =
      `<p class="empty">
        ${emptyMessage}
      </p>`;

    return;
  }

  container.innerHTML =
    items.map(item => `

      <div class="accommodation-card">

        <h3>
          ${escapeHTML(
            item.name || "إقامة"
          )}
        </h3>

        ${
          item.city
            ? `<p>📍 ${escapeHTML(
                item.city
              )}</p>`
            : ""
        }

        ${
          item.address
            ? `<p>📌 ${escapeHTML(
                item.address
              )}</p>`
            : ""
        }

        ${
          item.description
            ? `<p>${escapeHTML(
                item.description
              )}</p>`
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
          item.phone
            ? `<a
                href="tel:${escapeHTML(
                  item.phone
                )}"
                class="btn">
                📞 اتصال
              </a>`
            : ""
        }

      </div>

    `).join("");
}


function showError(
  container,
  message
) {

  if (!container) return;

  container.innerHTML =
    `<p class="empty">
      خطأ الاتصال: ${escapeHTML(
        message || "غير معروف"
      )}
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
  testConnection
);

const SUPABASE_URL =
  "https://rbmttbxsezttysenbcwn.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_tVChEdNRQHs9lrYPjA4ajQ_heTXT2x2";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

let accommodations = [];


/* تحميل الإقامات من Supabase */
async function loadAccommodations() {

  const list =
    document.getElementById("accommodationsList");

  if (!list) return;

  list.innerHTML =
    '<p class="loading">جاري تحميل الإقامات...</p>';

  try {

    const { data, error } =
      await supabaseClient
        .from("accommodations")
        .select("*")
        .order("id", { ascending: false });

    if (error) {
      throw error;
    }

    accommodations = data || [];

    displayAccommodations();

  } catch (error) {

    console.error(
      "Supabase error:",
      error
    );

    list.innerHTML =
      '<p class="empty">تعذر تحميل الإقامات حالياً.</p>';
  }
}


/* عرض الإقامات */
function displayAccommodations() {

  const list =
    document.getElementById("accommodationsList");

  if (!list) return;

  if (!accommodations.length) {

    list.innerHTML =
      '<p class="empty">لا توجد إقامات مضافة حالياً.</p>';

    return;
  }

  list.innerHTML =
    accommodations
      .map((item) => {

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
              item.price
                ? `<p>💰 ${escapeHTML(String(item.price))}</p>`
                : ""
            }

            ${
              item.description
                ? `<p>${escapeHTML(item.description)}</p>`
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

      })
      .join("");
}


/* حماية النصوص القادمة من قاعدة البيانات */
function escapeHTML(value) {

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


/* تشغيل الموقع */
document.addEventListener(
  "DOMContentLoaded",
  loadAccommodations
);

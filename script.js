const SUPABASE_URL =
  "https://rbmttbxsezttysenbcwn.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_tVChEdNRQHs9lrYPjA4ajQ_heTXT2xw";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

let accommodations = [];

async function loadAccommodations() {

  const list =
    document.getElementById("accommodation-list");

  if (!list) return;

  list.innerHTML =
    "<p class='loading'>جاري تحميل الإقامات...</p>";

  const { data, error } =
    await supabaseClient
      .from("accommodations")
      .select("*")
      .order("id", { ascending: true });

  if (error) {

    console.error(error);

    list.innerHTML =
      "<p class='error'>حدث خطأ أثناء تحميل الإقامات.</p>";

    return;
  }

  accommodations = data || [];

  displayAccommodations(accommodations);
}


function displayAccommodations(items) {

  const list =
    document.getElementById("accommodation-list");

  if (!list) return;

  list.innerHTML = "";

  if (!items.length) {

    list.innerHTML =
      "<p class='loading'>لا توجد إقامات متاحة حاليًا.</p>";

    return;
  }

  items.forEach(function(item) {

    const card =
      document.createElement("div");

    card.className = "card";

    let image = "";

    if (item.image_url) {

      image = `
        <img
          src="${item.image_url}"
          alt="${item.name || "إقامة سياحية"}"
        >
      `;
    }


    let whatsapp = "";

    if (item.phone) {

      const phoneNumber =
        String(item.phone)
          .replace(/\s/g, "")
          .replace(/\+/g, "");

      whatsapp = `
        <a
          class="whatsapp"
          href="https://wa.me/${phoneNumber}"
          target="_blank"
          rel="noopener"
        >
          💬 واتساب
        </a>
      `;
    }


    let map = "";

    if (item.city || item.address) {

      const location =
        encodeURIComponent(
          (item.address || "") +
          " " +
          (item.city || "")
        );

      map = `
        <a
          class="map-button"
          href="https://www.google.com/maps/search/?api=1&query=${location}"
          target="_blank"
          rel="noopener"
        >
          📍 الموقع على الخريطة
        </a>
      `;
    }


    let category = "";

    if (item.type) {

      category = `
        <p>
          🏨 ${item.type}
        </p>
      `;
    }


    const price =
      item.price_per_night ||
      item.price ||
      null;


    card.innerHTML = `

      ${image}

      <h3>
        ${item.name || "إقامة سياحية"}
      </h3>

      ${category}

      <p>
        ${item.description || ""}
      </p>

      <p>
        💰 ${
          price
            ? price + " درهم / ليلة"
            : "السعر عند التواصل"
        }
      </p>

      <p class="phone">
        📞 ${item.phone || "غير متوفر"}
      </p>

      ${whatsapp}

      ${map}

    `;

    list.appendChild(card);

  });
}


const searchInput =
  document.getElementById("searchAccommodation");

if (searchInput) {

  searchInput.addEventListener(
    "input",
    function() {

      const search =
        this.value.toLowerCase().trim();

      const filtered =
        accommodations.filter(function(item) {

          const name =
            (item.name || "").toLowerCase();

          const description =
            (item.description || "").toLowerCase();

          const city =
            (item.city || "").toLowerCase();

          const address =
            (item.address || "").toLowerCase();

          const type =
            (item.type || "").toLowerCase();

          return (
            name.includes(search) ||
            description.includes(search) ||
            city.includes(search) ||
            address.includes(search) ||
            type.includes(search)
          );

        });

      displayAccommodations(filtered);

    }
  );
}


loadAccommodations();

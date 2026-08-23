const SUPABASE_URL =
  "https://rbmttbxsezttysenbcwn.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_tVChEdNRQHs9lrYPjA4ajQ_heTXT2x2";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

let accommodations = [];


/* =========================
   تحميل الإقامات
========================= */

async function loadAccommodations() {

  const list =
    document.getElementById("accommodation-list");

  if (!list) return;

  list.innerHTML =
    "<p class='loading'>جاري تحميل الإقامات...</p>";

  try {

    const { data, error } =
      await supabaseClient
        .from("accommodations")
        .select("*")
        .order("id", { ascending: true });

    if (error) {
      console.error("Supabase Error:", error);

      list.innerHTML =
        "<p class='loading'>تعذر تحميل الإقامات حاليًا.</p>";

      return;
    }

    accommodations = data || [];

    displayAccommodations(accommodations);

  } catch (error) {

    console.error(error);

    list.innerHTML =
      "<p class='loading'>حدث خطأ أثناء الاتصال بقاعدة البيانات.</p>";
  }
}


/* =========================
   عرض الإقامات
========================= */

function displayAccommodations(items) {

  const list =
    document.getElementById("accommodation-list");

  if (!list) return;

  list.innerHTML = "";

  if (!items || items.length === 0) {

    list.innerHTML =
      "<p class='loading'>لا توجد إقامات متاحة حاليًا.</p>";

    return;
  }


  items.forEach(function(item) {

    const card =
      document.createElement("div");

    card.className = "card";


    /* الصورة */

    if (item.image_url) {

      const image =
        document.createElement("img");

      image.src = item.image_url;

      image.alt =
        item.name || "إقامة سياحية";

      image.loading = "lazy";

      card.appendChild(image);
    }


    /* الاسم */

    const title =
      document.createElement("h3");

    title.textContent =
      item.name || "إقامة سياحية";

    card.appendChild(title);


    /* النوع */

    if (item.type) {

      const type =
        document.createElement("p");

      type.textContent =
        "🏨 " + item.type;

      card.appendChild(type);
    }


    /* الوصف */

    if (item.description) {

      const description =
        document.createElement("p");

      description.textContent =
        item.description;

      card.appendChild(description);
    }


    /* السعر */

    const price =
      item.price_per_night ||
      item.price ||
      null;

    const priceText =
      document.createElement("p");

    priceText.textContent =
      price
        ? "💰 " + price + " درهم / ليلة"
        : "💰 السعر عند التواصل";

    card.appendChild(priceText);


    /* الهاتف */

    const phone =
      document.createElement("p");

    phone.className = "phone";

    phone.textContent =
      "📞 " + (item.phone || "غير متوفر");

    card.appendChild(phone);


    /* واتساب */

    if (item.phone) {

      const phoneNumber =
        String(item.phone)
          .replace(/\s/g, "")
          .replace(/^\+/, "");

      const whatsapp =
        document.createElement("a");

      whatsapp.className = "whatsapp";

      whatsapp.href =
        "https://wa.me/" + phoneNumber;

      whatsapp.target = "_blank";

      whatsapp.rel = "noopener noreferrer";

      whatsapp.textContent =
        "💬 واتساب";

      card.appendChild(whatsapp);
    }


    /* الخريطة */

    if (item.city || item.address) {

      const location =
        encodeURIComponent(
          (item.address || "") +
          " " +
          (item.city || "")
        );

      const map =
        document.createElement("a");

      map.className = "map-button";

      map.href =
        "https://www.google.com/maps/search/?api=1&query=" +
        location;

      map.target = "_blank";

      map.rel = "noopener noreferrer";

      map.textContent =
        "📍 الموقع على الخريطة";

      card.appendChild(map);
    }


    list.appendChild(card);

  });
}


/* =========================
   البحث
========================= */

const searchInput =
  document.getElementById("searchAccommodation");

if (searchInput) {

  searchInput.addEventListener(
    "input",
    function() {

      const search =
        this.value
          .toLowerCase()
          .trim();


      const filtered =
        accommodations.filter(function(item) {

          const name =
            String(item.name || "")
              .toLowerCase();

          const description =
            String(item.description || "")
              .toLowerCase();

          const city =
            String(item.city || "")
              .toLowerCase();

          const address =
            String(item.address || "")
              .toLowerCase();

          const type =
            String(item.type || "")
              .toLowerCase();


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


/* =========================
   تشغيل الموقع
========================= */

loadAccommodations();

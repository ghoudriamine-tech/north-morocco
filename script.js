/* =========================================
   شمال المغرب 🇲🇦
   script.js - النسخة النهائية
========================================= */


/* =========================================
   إعداد Supabase
========================================= */

const SUPABASE_URL =
  "https://rbmttbxsezttysenbcwn.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_tVChEdNRQHs9lrYPjA4ajx2";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);


/* =========================================
   المتغيرات
========================================= */

let accommodations = [];


/* =========================================
   عناصر الصفحة
========================================= */

const accommodationList =
  document.getElementById("accommodation-list");

const searchInput =
  document.getElementById("searchAccommodation");


/* =========================================
   تحميل الإقامات من Supabase
========================================= */

async function loadAccommodations() {

  if (!accommodationList) return;

  accommodationList.innerHTML =
    "<p class='loading'>جاري تحميل الإقامات...</p>";

  try {

    const { data, error } =
      await supabaseClient
        .from("accommodations")
        .select("*")
        .order("id", { ascending: true });


    if (error) {

      console.error(
        "Supabase Error:",
        error
      );

      accommodationList.innerHTML =
        "<p class='loading'>تعذر تحميل الإقامات حاليًا.</p>";

      return;
    }


    accommodations =
      Array.isArray(data)
        ? data
        : [];


    displayAccommodations(
      accommodations
    );

  } catch (error) {

    console.error(
      "Connection Error:",
      error
    );

    accommodationList.innerHTML =
      "<p class='loading'>حدث خطأ أثناء الاتصال بقاعدة البيانات.</p>";
  }
}


/* =========================================
   عرض الإقامات
========================================= */

function displayAccommodations(items) {

  if (!accommodationList) return;

  accommodationList.innerHTML = "";


  /* لا توجد نتائج */

  if (
    !items ||
    items.length === 0
  ) {

    accommodationList.innerHTML =
      "<p class='loading'>لا توجد إقامات مطابقة حاليًا.</p>";

    return;
  }


  /* إنشاء البطاقات */

  items.forEach(function(item) {

    const card =
      document.createElement("div");

    card.className =
      "card";


    /* =====================================
       الصورة
    ===================================== */

    if (item.image_url) {

      const image =
        document.createElement("img");

      image.src =
        item.image_url;

      image.alt =
        item.name ||
        "إقامة سياحية في شمال المغرب";

      image.loading =
        "lazy";

      image.onerror =
        function() {
          this.style.display = "none";
        };

      card.appendChild(image);
    }


    /* =====================================
       الاسم
    ===================================== */

    const title =
      document.createElement("h3");

    title.textContent =
      item.name ||
      "إقامة سياحية";

    card.appendChild(title);


    /* =====================================
       النوع
    ===================================== */

    if (item.type) {

      const type =
        document.createElement("p");

      type.className =
        "accommodation-type";

      type.textContent =
        "🏨 " + item.type;

      card.appendChild(type);
    }


    /* =====================================
       المدينة
    ===================================== */

    if (item.city) {

      const city =
        document.createElement("p");

      city.className =
        "city";

      city.textContent =
        "📍 " + item.city;

      card.appendChild(city);
    }


    /* =====================================
       العنوان
    ===================================== */

    if (item.address) {

      const address =
        document.createElement("p");

      address.className =
        "address";

      address.textContent =
        "🏠 " + item.address;

      card.appendChild(address);
    }


    /* =====================================
       الوصف
    ===================================== */

    if (item.description) {

      const description =
        document.createElement("p");

      description.className =
        "description";

      description.textContent =
        item.description;

      card.appendChild(description);
    }


    /* =====================================
       السعر
    ===================================== */

    const price =
      item.price_per_night ??
      item.price ??
      null;


    const priceElement =
      document.createElement("p");

    priceElement.className =
      "price";


    if (
      price !== null &&
      price !== ""
    ) {

      priceElement.textContent =
        "💰 " +
        price +
        " درهم / ليلة";

    } else {

      priceElement.textContent =
        "💰 السعر عند التواصل";
    }


    card.appendChild(priceElement);


    /* =====================================
       الهاتف
    ===================================== */

    if (item.phone) {

      const phone =
        document.createElement("p");

      phone.className =
        "phone";

      phone.textContent =
        "📞 " +
        item.phone;

      card.appendChild(phone);
    }


    /* =====================================
       أزرار البطاقة
    ===================================== */

    const buttons =
      document.createElement("div");

    buttons.className =
      "card-buttons";


    /* =====================================
       زر واتساب
    ===================================== */

    if (item.phone) {

      const phoneNumber =
        String(item.phone)
          .replace(/[^\d]/g, "");


      if (phoneNumber.length >= 8) {

        const whatsapp =
          document.createElement("a");

        whatsapp.className =
          "whatsapp";

        whatsapp.href =
          "https://wa.me/" +
          phoneNumber;

        whatsapp.target =
          "_blank";

        whatsapp.rel =
          "noopener noreferrer";

        whatsapp.textContent =
          "💬 واتساب";

        buttons.appendChild(
          whatsapp
        );
      }
    }


    /* =====================================
       زر الخريطة
    ===================================== */

    if (
      item.city ||
      item.address
    ) {

      const location =
        encodeURIComponent(
          [
            item.address || "",
            item.city || "",
            "المغرب"
          ]
            .filter(Boolean)
            .join(" ")
        );


      const map =
        document.createElement("a");

      map.className =
        "map-button";

      map.href =
        "https://www.google.com/maps/search/?api=1&query=" +
        location;

      map.target =
        "_blank";

      map.rel =
        "noopener noreferrer";

      map.textContent =
        "📍 الخريطة";

      buttons.appendChild(
        map
      );
    }


    /* إضافة الأزرار */

    if (buttons.children.length > 0) {

      card.appendChild(
        buttons
      );
    }


    /* إضافة البطاقة للقائمة */

    accommodationList.appendChild(
      card
    );

  });
}


/* =========================================
   البحث عن الإقامات
========================================= */

if (searchInput) {

  searchInput.addEventListener(
    "input",
    function() {

      const search =
        this.value
          .toLowerCase()
          .trim();


      /* إذا كان البحث فارغًا */

      if (!search) {

        displayAccommodations(
          accommodations
        );

        return;
      }


      /* تصفية النتائج */

      const filtered =
        accommodations.filter(
          function(item) {

            const searchableText = [

              item.name,
              item.type,
              item.city,
              item.address,
              item.description

            ]
              .filter(Boolean)
              .join(" ")
              .toLowerCase();


            return searchableText
              .includes(search);

          }
        );


      displayAccommodations(
        filtered
      );

    }
  );
}


/* =========================================
   تشغيل الموقع
========================================= */

document.addEventListener(
  "DOMContentLoaded",
  function() {

    loadAccommodations();

  }
);


/* =========================================
   تحديث الإقامات يدويًا
========================================= */

window.reloadAccommodations =
  function() {

    loadAccommodations();

  };

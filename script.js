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

  try {

    const {
      data,
      error
    } = await supabaseClient
      .from("accommodations")
      .select("*")
      .order("id", {
        ascending: false
      });

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

    showError(
      "apartmentsList"
    );

    showError(
      "hotelsList"
    );

    showError(
      "riadsList"
    );
  }
}


/* =========================
   عرض الإقامات
========================= */

function displayAccommodations() {

  const apartments =
    accommodations.filter(
      item =>
        normalizeType(item.type) ===
        "شقق مفروشة"
    );

  const hotels =
    accommodations.filter(
      item =>
        normalizeType(item.type) ===
        "فنادق"
    );

  const riads =
    accommodations.filter(
      item =>
        normalizeType(item.type) ===
        "رياضات"
    );


  renderList(
    "apartmentsList",
    apartments,
    "لا توجد شقق مفروشة مضافة حالياً."
  );


  renderList(
    "hotelsList",
    hotels,
    "لا توجد فنادق مضافة حالياً."
  );


  renderList(
    "riadsList",
    riads,
    "لا توجد رياضات مضافة حالياً."
  );
}


/* =========================
   توحيد نوع الإقامة
========================= */

function normalizeType(type) {

  if (!type) {
    return "";
  }

  const value =
    String(type)
      .trim()
      .toLowerCase();


  if (
    value === "شقة مفروشة" ||
    value === "شقق مفروشة" ||
    value === "apartment" ||
    value === "apartments"
  ) {
    return "شقق مفروشة";
  }


  if (
    value === "فندق" ||
    value === "فنادق" ||
    value === "hotel" ||
    value === "hotels"
  ) {
    return "فنادق";
  }


  if (
    value === "رياض" ||
    value === "رياضات" ||
    value === "riads" ||
    value === "riad"
  ) {
    return "رياضات";
  }


  return value;
}


/* =========================
   إنشاء البطاقات
========================= */

function renderList(
  elementId,
  items,
  emptyMessage
) {

  const list =
    document.getElementById(
      elementId
    );

  if (!list) {
    return;
  }


  if (!items.length) {

    list.innerHTML =
      `<p class="empty">
        ${emptyMessage}
      </p>`;

    return;
  }


  list.innerHTML =
    items
      .map(
        item =>
          createAccommodationCard(
            item
          )
      )
      .join("");
}


/* =========================
   بطاقة الإقامة
========================= */

function createAccommodationCard(
  item
) {

  const name =
    escapeHTML(
      item.name ||
      "إقامة"
    );


  const city =
    item.city
      ? `<p>📍 ${escapeHTML(item.city)}</p>`
      : "";


  const address =
    item.address
      ? `<p>📌 ${escapeHTML(item.address)}</p>`
      : "";


  const description =
    item.description
      ? `<p>${escapeHTML(item.description)}</p>`
      : "";


  const price =
    item.price
      ? `<p>💰 ${escapeHTML(
          String(item.price)
        )} درهم</p>`
      : item.price_per_night
      ? `<p>💰 ${escapeHTML(
          String(item.price_per_night)
        )} درهم / ليلة</p>`
      : "";


  const phone =
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
      : "";


  return `
    <div class="accommodation-card">

      <h3>
        ${name}
      </h3>

      ${city}

      ${address}

      ${description}

      ${price}

      ${phone}

    </div>
  `;
}


/* =========================
   حماية النصوص
========================= */

function escapeHTML(
  value
) {

  return String(value)
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
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
   عرض الخطأ
========================= */

function showError(
  elementId
) {

  const element =
    document.getElementById(
      elementId
    );

  if (!element) {
    return;
  }

  element.innerHTML =
    `<p class="empty">
      تعذر تحميل البيانات حالياً.
    </p>`;
}


/* =========================
   تشغيل الموقع
========================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    loadAccommodations();

  }
);

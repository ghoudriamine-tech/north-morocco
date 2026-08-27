/* =========================================
🗺️ شمال المغرب
الأنشطة والجولات
========================================= */

async function loadActivities() {

try {

const controller = new AbortController();

const timeout = setTimeout(() => {
  controller.abort();
}, 10000);

const response = await fetch(
  `${SUPABASE_URL}/rest/v1/activities?select=*`,
  {
    method: "GET",
    headers: supabaseHeaders(),
    signal: controller.signal
  }
);

clearTimeout(timeout);

if (!response.ok) {

  const errorText =
    await response.text();

  throw new Error(
    `HTTP ${response.status}: ${errorText}`
  );

}

const data =
  await response.json();

console.log(
  "Activities data:",
  data
);

displayActivities(data);

} catch (error) {

console.error(
  "Activities error:",
  error
);

let message;

if (error.name === "AbortError") {

  message =
    "انتهت مهلة تحميل الأنشطة. لم يستجب الخادم خلال 10 ثوانٍ.";

} else {

  message =
    `خطأ في تحميل الأنشطة:<br>${escapeHTML(
      error.message || String(error)
    )}`;

}

[
  "beachesList",
  "historicalCitiesList",
  "guidesList"
].forEach(id => {

  const container =
    document.getElementById(id);

  if (container) {

    container.innerHTML =
      `<p class="empty">${message}</p>`;

  }

});

}

}

function displayActivities(data) {

const beaches =
data.filter(item =>
isActivityType(
item,
[
"beach",
"شاطئ",
"الشواطئ"
]
)
);

const historicalCities =
data.filter(item =>
isActivityType(
item,
[
"historical_city",
"historical city",
"مدينة تاريخية",
"المدن التاريخية"
]
)
);

const guides =
data.filter(item =>
isActivityType(
item,
[
"tour_guide",
"tour guide",
"مرشد سياحي",
"المرشدون السياحيون"
]
)
);

displayActivityList(
"beachesList",
beaches,
"لا توجد أنشطة شاطئية حالياً."
);

displayActivityList(
"historicalCitiesList",
historicalCities,
"لا توجد مدن أو جولات تاريخية حالياً."
);

displayActivityList(
"guidesList",
guides,
"لا يوجد مرشدون سياحيون حالياً."
);

}

function isActivityType(item, types) {

const value =
String(
item.activity_type || ""
)
.trim()
.toLowerCase();

return types.some(type =>
value ===
String(type)
.trim()
.toLowerCase()
);

}

function displayActivityList(
id,
items,
emptyMessage
) {

const container =
document.getElementById(id);

if (!container) return;

if (!items.length) {

container.innerHTML =
  `<p class="empty">${emptyMessage}</p>`;

return;

}

container.innerHTML =
items.map(item => {

  const name =
    item.name ||
    "نشاط سياحي";

  const phone =
    item.phone
      ? String(item.phone).trim()
      : "";

  let whatsapp =
    item.whatsapp
      ? String(item.whatsapp)
          .replace(/\D/g, "")
      : phone.replace(/\D/g, "");

  if (whatsapp.startsWith("0")) {

    whatsapp =
      "212" +
      whatsapp.substring(1);

  }

  const image =
    item.image_url
      ? `
        <img
          src="${escapeHTML(item.image_url)}"
          alt="${escapeHTML(name)}"
          class="accommodation-image"
          loading="lazy">
      `
      : "";

  /* 📞 اتصال — أيقونة فقط */

  const phoneButton =
    phone
      ? `
        <a
          href="tel:${escapeHTML(phone)}"
          class="btn"
          aria-label="اتصال"
          title="اتصال">
          📞
        </a>
      `
      : "";

  /* 💬 واتساب — أيقونة فقط */

  const whatsappButton =
    whatsapp
      ? `
        <a
          href="https://wa.me/${whatsapp}"
          class="btn whatsapp-accommodation"
          target="_blank"
          rel="noopener"
          aria-label="واتساب"
          title="واتساب">
          💬
        </a>
      `
      : "";

  /* 📍 الموقع — أيقونة فقط */

  const mapButton =
    item.map_url
      ? `
        <a
          href="${escapeHTML(item.map_url)}"
          class="btn"
          target="_blank"
          rel="noopener"
          aria-label="الموقع"
          title="الموقع">
          📍
        </a>
      `
      : "";

  const price =
    item.price ??
    "";

  /* 📋 طلب الخدمة — يبقى مكتوبًا */

  const requestButton = `
    <button
      type="button"
      class="btn"
      onclick="selectService(
        'activity',
        '${escapeJS(item.id)}',
        '${escapeJS(name)}'
      )">
      📋 اطلب هذه الخدمة
    </button>
  `;

  return `
    <div class="accommodation-card">

      ${image}

      <h3>
        ${escapeHTML(name)}
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
        price !== ""
          ? `
            <p>
              💰 ${escapeHTML(price)} درهم
            </p>
          `
          : ""
      }

      <div class="accommodation-buttons">

        ${phoneButton}

        ${whatsappButton}

        ${mapButton}

        ${requestButton}

      </div>

      ${renderReviews(
        "activity",
        item.id
      )}

    </div>
  `;

}).join("");

}

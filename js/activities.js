/* =========================================
   🗺️ الأنشطة والجولات
   تحميل الأنشطة من Supabase
========================================= */

async function loadActivities() {

  try {

    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/activities?select=*`,
      {
        method: "GET",
        headers: supabaseHeaders()
      }
    );

    if (!response.ok) {

      const errorText =
        await response.text();

      console.error(
        "Activities HTTP error:",
        response.status,
        errorText
      );

      showActivitiesError(
        `HTTP ${response.status}: ${errorText}`
      );

      return;
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

    showActivitiesError(
      error.message || String(error)
    );

  }
}


/* =========================================
   تقسيم الأنشطة
========================================= */

function displayActivities(data) {

  const beaches =
    data.filter(item =>
      isActivityType(
        item.activity_type,
        [
          "beach",
          "شاطئ",
          "الشاطئ",
          "الشواطئ",
          "beaches"
        ]
      )
    );


  const historicalCities =
    data.filter(item =>
      isActivityType(
        item.activity_type,
        [
          "historical_city",
          "historical city",
          "historical",
          "city",
          "مدينة تاريخية",
          "مدينة تاريخية",
          "المدن التاريخية",
          "مدن تاريخية"
        ]
      )
    );


  const guides =
    data.filter(item =>
      isActivityType(
        item.activity_type,
        [
          "tour_guide",
          "tour guide",
          "guide",
          "guides",
          "مرشد",
          "مرشد سياحي",
          "مرشد سياحي",
          "المرشدون السياحيون",
          "مرشدين سياحيين"
        ]
      )
    );


  console.log(
    "Beaches:",
    beaches
  );

  console.log(
    "Historical cities:",
    historicalCities
  );

  console.log(
    "Guides:",
    guides
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


/* =========================================
   فحص نوع النشاط
========================================= */

function isActivityType(
  value,
  types
) {

  if (!value) return false;


  const normalized =
    String(value)
      .trim()
      .toLowerCase();


  return types.some(type => {

    const normalizedType =
      String(type)
        .trim()
        .toLowerCase();

    return normalized === normalizedType;

  });

}


/* =========================================
   عرض قائمة الأنشطة
========================================= */

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


      const phoneButton =
        phone
          ? `
            <a
              href="tel:${escapeHTML(phone)}"
              class="btn">
              📞 اتصال
            </a>
          `
          : "";


      const whatsappButton =
        whatsapp
          ? `
            <a
              href="https://wa.me/${whatsapp}"
              class="btn whatsapp-accommodation"
              target="_blank"
              rel="noopener">
              💬 واتساب
            </a>
          `
          : "";


      const mapButton =
        item.map_url
          ? `
            <a
              href="${escapeHTML(item.map_url)}"
              class="btn"
              target="_blank"
              rel="noopener">
              📍 الموقع
            </a>
          `
          : "";


      const price =
        item.price ??
        "";


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

        </div>
      `;

    }).join("");

}


/* =========================================
   رسالة الخطأ
========================================= */

function showActivitiesError(
  errorMessage
) {

  const message =
    `
      <p class="empty">
        تعذر تحميل الأنشطة حالياً.
      </p>

      <small>
        ${escapeHTML(errorMessage || "")}
      </small>
    `;


  [
    "beachesList",
    "historicalCitiesList",
    "guidesList"
  ].forEach(id => {

    const container =
      document.getElementById(id);

    if (container) {

      container.innerHTML =
        message;

    }

  });

}

/* =========================================
   🗺️ شمال المغرب
   الأنشطة والجولات
   الرحلات + المرشدون السياحيون
========================================= */


/* =========================================
   تحميل الأنشطة والجولات
========================================= */

async function loadActivities() {

  try {

    const controller =
      new AbortController();

    const timeout =
      setTimeout(() => {
        controller.abort();
      }, 10000);


    const response =
      await fetch(
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


    if (
      error.name === "AbortError"
    ) {

      message =
        "انتهت مهلة تحميل الأنشطة والجولات.";

    } else {

      message =
        `خطأ في تحميل الأنشطة والجولات:<br>${escapeHTML(
          error.message || String(error)
        )}`;

    }


    [
      "tripsList",
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


/* =========================================
   تقسيم الأنشطة
========================================= */

function displayActivities(data) {


  const trips =
    data.filter(item =>
      isActivityType(
        item,
        [
          "trip"
        ]
      )
    );


  const guides =
    data.filter(item =>
      isActivityType(
        item,
        [
          "tour_guide"
        ]
      )
    );


  displayActivityList(
    "tripsList",
    trips,
    "لا توجد رحلات حالياً."
  );


  displayActivityList(
    "guidesList",
    guides,
    "لا يوجد مرشدون سياحيون حالياً."
  );

}


/* =========================================
   التحقق من نوع النشاط
========================================= */

function isActivityType(
  item,
  types
) {

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


/* =========================================
   عرض بطاقات الرحلات والمرشدين
========================================= */

function displayActivityList(
  id,
  items,
  emptyMessage
) {

  const container =
    document.getElementById(id);


  if (!container) {
    return;
  }


  if (!items.length) {

    container.innerHTML =
      `<p class="empty">${emptyMessage}</p>`;

    return;

  }


  container.innerHTML =
    items.map(item => {


      const name =
        item.name ||
        "خدمة سياحية";


      const phone =
        item.phone
          ? String(item.phone).trim()
          : "";


      let whatsapp =
        item.whatsapp
          ? String(item.whatsapp)
              .replace(/\D/g, "")
          : phone.replace(/\D/g, "");


      if (
        whatsapp.startsWith("0")
      ) {

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


      /* =================================
         زر الاتصال
      ================================= */

      const phoneButton =
        phone
          ? `
            <a
              href="tel:${escapeHTML(phone)}"
              class="btn">
              📞
            </a>
          `
          : "";


      /* =================================
         زر واتساب
      ================================= */

      const whatsappButton =
        whatsapp
          ? `
            <a
              href="https://wa.me/${whatsapp}"
              class="btn whatsapp-accommodation"
              target="_blank"
              rel="noopener">
              💬
            </a>
          `
          : "";


      /* =================================
         زر الموقع
      ================================= */

      const mapButton =
        item.map_url
          ? `
            <a
              href="${escapeHTML(item.map_url)}"
              class="btn"
              target="_blank"
              rel="noopener">
              📍
            </a>
          `
          : "";


      /* =================================
         طلب الخدمة
      ================================= */

      const requestButton = `
        <button
          type="button"
          class="btn"
          onclick="selectService(
            'activity',
            '${escapeJS(item.id)}',
            '${escapeJS(name)}'
          )">
          📋
        </button>
      `;


      return `

        <div
          class="accommodation-card activity-card"
          onclick="toggleActivityCard(this)"
        >


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
            item.price !== null &&
            item.price !== undefined &&
            item.price !== ""
              ? `
                <p>
                  💰 ${escapeHTML(item.price)} درهم
                </p>
              `
              : ""
          }


          <!-- الأزرار تظهر عند فتح البطاقة -->

          <div
            class="activity-card-details"
            onclick="event.stopPropagation()"
          >


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


        </div>

      `;

    }).join("");

}


/* =========================================
   فتح وإغلاق بطاقة النشاط
========================================= */

function toggleActivityCard(card) {

  if (!card) {
    return;
  }


  card.classList.toggle(
    "activity-card-open"
  );

}


/* =========================================
   تشغيل التحميل
========================================= */

document.addEventListener(
  "DOMContentLoaded",
  function () {

    loadActivities();

  }
);

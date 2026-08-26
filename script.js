const SUPABASE_URL =
  "https://rbmttbxsezttysenbcwn.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_tVChEdNRQHs9lrYPjA4ajQ_heTXT2xw";


/* =========================
   أدوات عامة
========================= */

function escapeHTML(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


function whatsappNumber(value) {

  if (!value) return "";

  let number =
    String(value).replace(/\D/g, "");

  if (number.startsWith("0")) {
    number =
      "212" + number.substring(1);
  }

  return number;
}


/* =========================
   الإقامات
========================= */

async function loadAccommodations() {

  try {

    const response =
      await fetch(
        `${SUPABASE_URL}/rest/v1/accommodations?select=*`,
        {
          headers: {
            "apikey": SUPABASE_KEY,
            "Authorization":
              `Bearer ${SUPABASE_KEY}`
          }
        }
      );


    if (!response.ok) {

      const error =
        await response.text();

      throw new Error(
        `HTTP ${response.status}: ${error}`
      );
    }


    const data =
      await response.json();

    displayAccommodations(data);

  }

  catch (error) {

    console.error(
      "Accommodations error:",
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
   تصنيف الإقامات
========================= */

function displayAccommodations(data) {

  const apartments =
    data.filter(item => {

      const type =
        String(item.type || "")
          .trim()
          .toLowerCase();

      return (
        type === "شقق مفروشة" ||
        type === "شقة مفروشة" ||
        type === "apartment"
      );

    });


  const hotels =
    data.filter(item => {

      const type =
        String(item.type || "")
          .trim()
          .toLowerCase();

      return (
        type === "فنادق" ||
        type === "فندق" ||
        type === "hotel"
      );

    });


  const riads =
    data.filter(item => {

      const type =
        String(item.type || "")
          .trim()
          .toLowerCase();

      return (
        type === "رياضات" ||
        type === "رياض" ||
        type === "riad"
      );

    });


  displayAccommodationList(
    "apartmentsList",
    apartments,
    "لا توجد شقق مفروشة حالياً."
  );


  displayAccommodationList(
    "hotelsList",
    hotels,
    "لا توجد فنادق حالياً."
  );


  displayAccommodationList(
    "riadsList",
    riads,
    "لا توجد رياضات حالياً."
  );
}


/* =========================
   عرض الإقامات
========================= */

function displayAccommodationList(
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

      const phone =
        String(item.phone || "").trim();

      const whatsapp =
        whatsappNumber(
          item.whatsapp || phone
        );


      const image =
        item.image_url
          ? `
            <img
              src="${escapeHTML(item.image_url)}"
              alt="${escapeHTML(item.name || "الإقامة")}"
              class="accommodation-image"
              loading="lazy"
              onerror="this.style.display='none'"
            >
          `
          : "";


      const price =
        item.price_per_night ??
        item.price;


      return `

        <div class="accommodation-card">

          ${image}

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
            price !== null &&
            price !== undefined &&
            price !== ""
              ? `
                <p>
                  💰
                  ${escapeHTML(price)}
                  درهم / ليلة
                </p>
              `
              : ""
          }


          <div class="accommodation-buttons">

            ${
              phone
                ? `
                  <a
                    href="tel:${escapeHTML(phone)}"
                    class="btn">
                    📞 اتصال
                  </a>
                `
                : ""
            }


            ${
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
                : ""
            }


            ${
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
                : ""
            }

          </div>

        </div>

      `;

    }).join("");
}


/* =========================
   المواصلات
========================= */

async function loadTransportServices() {

  try {

    const response =
      await fetch(
        `${SUPABASE_URL}/rest/v1/transport_services?select=*`,
        {
          headers: {
            "apikey": SUPABASE_KEY,
            "Authorization":
              `Bearer ${SUPABASE_KEY}`
          }
        }
      );


    if (!response.ok) {

      const error =
        await response.text();

      throw new Error(
        `HTTP ${response.status}: ${error}`
      );
    }


    const data =
      await response.json();


    displayTransport(
      data
    );

  }

  catch (error) {

    console.error(
      "Transport error:",
      error
    );

    showError(
      "carRentalList"
    );

    showError(
      "taxiList"
    );

    showError(
      "busList"
    );
  }
}


/* =========================
   عرض المواصلات
========================= */

function displayTransport(data) {

  const cars =
    data.filter(item =>
      isTransportType(
        item.service_type,
        [
          "كراء السيارات",
          "كراء سيارة",
          "سيارات",
          "car",
          "car_rental"
        ]
      )
    );


  const taxis =
    data.filter(item =>
      isTransportType(
        item.service_type,
        [
          "سيارات الأجرة",
          "سيارة أجرة",
          "طاكسي",
          "تاكسي",
          "taxi"
        ]
      )
    );


  const buses =
    data.filter(item =>
      isTransportType(
        item.service_type,
        [
          "الحافلات",
          "حافلة",
          "الحافلات السياحية الصغيرة",
          "bus",
          "minibus"
        ]
      )
    );


  displayTransportList(
    "carRentalList",
    cars,
    "لا توجد خدمات كراء السيارات حالياً."
  );


  displayTransportList(
    "taxiList",
    taxis,
    "لا توجد خدمات سيارات الأجرة حالياً."
  );


  displayTransportList(
    "busList",
    buses,
    "لا توجد خدمات الحافلات حالياً."
  );
}


/* =========================
   فحص نوع المواصلات
========================= */

function isTransportType(
  value,
  types
) {

  const current =
    String(value || "")
      .trim()
      .toLowerCase();


  return types.some(type =>
    current ===
    String(type)
      .trim()
      .toLowerCase()
  );
}


/* =========================
   بطاقات المواصلات
========================= */

function displayTransportList(
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

      const phone =
        String(item.phone || "").trim();

      const whatsapp =
        whatsappNumber(
          item.whatsapp || phone
        );


      return `

        <div class="card">

          ${
            item.image_url
              ? `
                <img
                  src="${escapeHTML(item.image_url)}"
                  class="accommodation-image"
                  loading="lazy"
                  alt="${escapeHTML(item.name || "خدمة مواصلات")}"
                  onerror="this.style.display='none'"
                >
              `
              : ""
          }


          <div class="service-icon">
            🚗
          </div>


          <h3>
            ${escapeHTML(
              item.name || "خدمة مواصلات"
            )}
          </h3>


          ${
            item.city
              ? `<p>📍 ${escapeHTML(item.city)}</p>`
              : ""
          }


          ${
            item.description
              ? `<p>${escapeHTML(item.description)}</p>`
              : ""
          }


          ${
            item.price !== null &&
            item.price !== undefined &&
            item.price !== ""
              ? `
                <p>
                  💰 ${escapeHTML(item.price)}
                  درهم
                </p>
              `
              : ""
          }


          <div class="accommodation-buttons">

            ${
              phone
                ? `
                  <a
                    href="tel:${escapeHTML(phone)}"
                    class="btn">
                    📞 اتصال
                  </a>
                `
                : ""
            }


            ${
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
                : ""
            }


            ${
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
                : ""
            }

          </div>

        </div>

      `;

    }).join("");
}


/* =========================
   الأنشطة
========================= */

async function loadActivities() {

  try {

    const response =
      await fetch(
        `${SUPABASE_URL}/rest/v1/activities?select=*`,
        {
          headers: {
            "apikey": SUPABASE_KEY,
            "Authorization":
              `Bearer ${SUPABASE_KEY}`
          }
        }
      );


    if (!response.ok) {

      const error =
        await response.text();

      throw new Error(
        `HTTP ${response.status}: ${error}`
      );
    }


    const data =
      await response.json();


    displayActivities(
      data
    );

  }

  catch (error) {

    console.error(
      "Activities error:",
      error
    );
  }
}


/* =========================
   عرض الأنشطة
========================= */

function displayActivities(data) {

  const section =
    document.querySelector(
      "#activities .cards"
    );

  if (!section) return;


  if (!data.length) {

    section.innerHTML =
      `<p class="empty">لا توجد أنشطة حالياً.</p>`;

    return;
  }


  section.innerHTML =
    data.map(item => {

      const whatsapp =
        whatsappNumber(
          item.whatsapp ||
          item.phone
        );


      return `

        <div class="card">

          ${
            item.image_url
              ? `
                <img
                  src="${escapeHTML(item.image_url)}"
                  class="accommodation-image"
                  loading="lazy"
                  alt="${escapeHTML(item.name || "نشاط")}"
                  onerror="this.style.display='none'"
                >
              `
              : `
                <div class="service-icon">
                  🗺️
                </div>
              `
          }


          <h3>
            ${escapeHTML(
              item.name || "نشاط سياحي"
            )}
          </h3>


          ${
            item.activity_type
              ? `<p>🧭 ${escapeHTML(item.activity_type)}</p>`
              : ""
          }


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
            item.price !== null &&
            item.price !== undefined &&
            item.price !== ""
              ? `
                <p>
                  💰 ${escapeHTML(item.price)}
                  درهم
                </p>
              `
              : ""
          }


          <div class="accommodation-buttons">

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


            ${
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
                : ""
            }


            ${
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
                : ""
            }

          </div>

        </div>

      `;

    }).join("");
}


/* =========================
   طلب الخدمة
========================= */

async function submitServiceRequest(event) {

  event.preventDefault();


  const form =
    document.getElementById(
      "serviceRequestForm"
    );

  const message =
    document.getElementById(
      "requestMessage"
    );

  const button =
    document.getElementById(
      "submitRequestBtn"
    );


  if (!form || !message || !button) {
    return;
  }


  const requesterName =
    document
      .getElementById("requester_name")
      .value
      .trim();


  const phone =
    document
      .getElementById("phone")
      .value
      .trim();


  const whatsapp =
    document
      .getElementById("whatsapp")
      .value
      .trim();


  const serviceType =
    document
      .getElementById("service_type")
      .value;


  const serviceId =
    document
      .getElementById("service_id")
      .value;


  const requestDate =
    document
      .getElementById("request_date")
      .value;


  const notes =
    document
      .getElementById("notes")
      .value
      .trim();


  if (
    !requesterName ||
    !serviceType ||
    !serviceId
  ) {

    message.textContent =
      "⚠️ يرجى ملء الحقول المطلوبة.";

    return;
  }


  button.disabled = true;

  button.textContent =
    "⏳ جاري إرسال الطلب...";

  message.textContent = "";


  try {

    const response =
      await fetch(
        `${SUPABASE_URL}/rest/v1/service_requests`,
        {
          method: "POST",

          headers: {
            "apikey": SUPABASE_KEY,
            "Authorization":
              `Bearer ${SUPABASE_KEY}`,
            "Content-Type":
              "application/json",
            "Prefer":
              "return=minimal"
          },

          body: JSON.stringify({

            service_type:
              serviceType,

            service_id:
              Number(serviceId),

            requester_name:
              requesterName,

            phone:
              phone || null,

            whatsapp:
              whatsapp || null,

            request_date:
              requestDate || null,

            notes:
              notes || null

          })
        }
      );


    if (!response.ok) {

      const error =
        await response.text();

      throw new Error(
        `HTTP ${response.status}: ${error}`
      );
    }


    message.textContent =
      "✅ تم إرسال طلبك بنجاح، سنتواصل معك قريبًا.";


    form.reset();

  }

  catch (error) {

    console.error(
      "Service request error:",
      error
    );

    message.textContent =
      "❌ تعذر إرسال الطلب حاليًا.";

  }

  finally {

    button.disabled = false;

    button.textContent =
      "📩 إرسال الطلب";
  }
}


/* =========================
   رسائل الخطأ
========================= */

function showError(id) {

  const container =
    document.getElementById(id);

  if (!container) return;

  container.innerHTML =
    `
      <p class="empty">
        تعذر تحميل البيانات حالياً.
      </p>
    `;
}


/* =========================
   تشغيل الموقع

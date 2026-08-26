/* =========================================
   🌊 شمال المغرب 🇲🇦
   Supabase
========================================= */

const SUPABASE_URL =
  "https://rbmttbxsezttysenbcwn.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_tVChEdNRQHs9lrYPjA4ajQ_heTXT2xw";


/* =========================================
   الاتصال بـ Supabase
========================================= */

function supabaseHeaders() {
  return {
    "apikey": SUPABASE_KEY,
    "Content-Type": "application/json"
  };
}


/* =========================================
   اختبار الاتصال
========================================= */

async function testSupabaseConnection() {

  console.log("🔵 اختبار الاتصال بـ Supabase...");

  try {

    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/accommodations?select=*`,
      {
        method: "GET",
        headers: supabaseHeaders()
      }
    );

    const text = await response.text();

    console.log("HTTP Status:", response.status);
    console.log("Supabase Response:", text);

    if (!response.ok) {

      throw new Error(
        `HTTP ${response.status}: ${text}`
      );

    }

    const data = JSON.parse(text);

    console.log(
      "✅ الاتصال بـ Supabase ناجح",
      data
    );

    displayAccommodations(data);

    return true;

  } catch (error) {

    console.error(
      "❌ Supabase Connection Error:",
      error
    );

    showError(
      "apartmentsList",
      error.message
    );

    showError(
      "hotelsList",
      error.message
    );

    showError(
      "riadsList",
      error.message
    );

    return false;
  }
}


/* =========================================
   الإقامات
========================================= */

function displayAccommodations(data) {

  const apartments = data.filter(item => {

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


  const hotels = data.filter(item => {

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


  const riads = data.filter(item => {

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


  displayList(
    "apartmentsList",
    apartments,
    "لا توجد شقق مفروشة حالياً."
  );


  displayList(
    "hotelsList",
    hotels,
    "لا توجد فنادق حالياً."
  );


  displayList(
    "riadsList",
    riads,
    "لا توجد رياضات حالياً."
  );

}


/* =========================================
   عرض الإقامات
========================================= */

function displayList(
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

    container.innerHTML = `
      <p class="empty">
        ${escapeHTML(emptyMessage)}
      </p>
    `;

    return;
  }


  container.innerHTML = items.map(item => {

    const phone =
      item.phone
        ? String(item.phone).trim()
        : "";


    let whatsappNumber = "";


    if (item.whatsapp) {

      whatsappNumber =
        String(item.whatsapp)
          .replace(/\D/g, "");

    }
    else if (phone) {

      whatsappNumber =
        phone.replace(/\D/g, "");

    }


    if (
      whatsappNumber.startsWith("0")
    ) {

      whatsappNumber =
        "212" +
        whatsappNumber.substring(1);

    }


    const image =
      item.image_url
        ? `
          <img
            src="${escapeHTML(item.image_url)}"
            alt="${escapeHTML(
              item.name || "صورة الإقامة"
            )}"
            class="accommodation-image"
            loading="lazy"
            onerror="this.style.display='none';"
          >
        `
        : "";


    let price = "";


    if (
      item.price_per_night !== null &&
      item.price_per_night !== undefined &&
      item.price_per_night !== ""
    ) {

      price = `
        <p>
          💰
          ${escapeHTML(
            String(item.price_per_night)
          )}
          درهم / ليلة
        </p>
      `;

    }
    else if (
      item.price !== null &&
      item.price !== undefined &&
      item.price !== ""
    ) {

      price = `
        <p>
          💰
          ${escapeHTML(
            String(item.price)
          )}
          درهم / ليلة
        </p>
      `;

    }


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
      whatsappNumber
        ? `
          <a
            href="https://wa.me/${whatsappNumber}"
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
            ? `
              <p>
                📍
                ${escapeHTML(item.city)}
              </p>
            `
            : ""
        }

        ${
          item.address
            ? `
              <p>
                📌
                ${escapeHTML(item.address)}
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

        ${price}

        ${
          phoneButton ||
          whatsappButton ||
          mapButton
            ? `
              <div class="accommodation-buttons">
                ${phoneButton}
                ${whatsappButton}
                ${mapButton}
              </div>
            `
            : ""
        }

      </div>

    `;

  }).join("");

}


/* =========================================
   المواصلات
========================================= */

async function loadTransportServices() {

  try {

    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/transport_services?select=*`,
      {
        method: "GET",
        headers: supabaseHeaders()
      }
    );


    const text =
      await response.text();


    console.log(
      "Transport HTTP:",
      response.status
    );


    console.log(
      "Transport Response:",
      text
    );


    if (!response.ok) {

      throw new Error(
        `HTTP ${response.status}: ${text}`
      );

    }


    const data =
      JSON.parse(text);


    displayTransportServices(data);


  } catch (error) {

    console.error(
      "❌ Transport error:",
      error
    );


    showError(
      "carRentalList",
      error.message
    );

    showError(
      "taxiList",
      error.message
    );

    showError(
      "busList",
      error.message
    );

  }

}


/* =========================================
   تصنيف المواصلات
========================================= */

function displayTransportServices(data) {

  const cars =
    data.filter(item =>
      isTransportType(
        item,
        [
          "car_rental",
          "car rental",
          "كراء السيارات",
          "تأجير السيارات",
          "سيارات للكراء"
        ]
      )
    );


  const taxis =
    data.filter(item =>
      isTransportType(
        item,
        [
          "taxi",
          "سيارات الأجرة",
          "سيارة أجرة",
          "taxi service"
        ]
      )
    );


  const buses =
    data.filter(item =>
      isTransportType(
        item,
        [
          "bus",
          "tourist_bus",
          "tourist bus",
          "حافلات",
          "حافلات سياحية صغيرة",
          "الحافلات السياحية الصغيرة"
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
    "لا توجد خدمات الحافلات السياحية حالياً."
  );

}


/* =========================================
   فحص نوع المواصلات
========================================= */

function isTransportType(item, types) {

  const values = [
    item.service_type,
    item.type,
    item.category,
    item.transport_type
  ];


  return values.some(value => {

    if (!value) {
      return false;
    }


    const normalized =
      String(value)
        .trim()
        .toLowerCase();


    return types.some(type =>
      normalized ===
      String(type)
        .trim()
        .toLowerCase()
    );

  });

}


/* =========================================
   عرض المواصلات
========================================= */

function displayTransportList(
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

    container.innerHTML = `
      <p class="empty">
        ${escapeHTML(emptyMessage)}
      </p>
    `;

    return;
  }


  container.innerHTML =
    items.map(item => {

      const name =
        item.name ||
        item.title ||
        "خدمة نقل";


      const description =
        item.description || "";


      const city =
        item.city || "";


      const phone =
        item.phone
          ? String(item.phone).trim()
          : "";


      let whatsappNumber = "";


      if (item.whatsapp) {

        whatsappNumber =
          String(item.whatsapp)
            .replace(/\D/g, "");

      }
      else if (phone) {

        whatsappNumber =
          phone.replace(/\D/g, "");

      }


      if (
        whatsappNumber.startsWith("0")
      ) {

        whatsappNumber =
          "212" +
          whatsappNumber.substring(1);

      }


      const image =
        item.image_url
          ? `
            <img
              src="${escapeHTML(item.image_url)}"
              alt="${escapeHTML(name)}"
              class="accommodation-image"
              loading="lazy"
            >
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
        whatsappNumber
          ? `
            <a
              href="https://wa.me/${whatsappNumber}"
              class="btn whatsapp-accommodation"
              target="_blank"
              rel="noopener">
              💬 واتساب
            </a>
          `
          : "";


      return `

        <div class="accommodation-card">

          ${image}

          <h3>
            ${escapeHTML(name)}
          </h3>

          ${
            city
              ? `
                <p>
                  📍
                  ${escapeHTML(city)}
                </p>
              `
              : ""
          }

          ${
            description
              ? `
                <p>
                  ${escapeHTML(description)}
                </p>
              `
              : ""
          }

          ${
            phoneButton ||
            whatsappButton
              ? `
                <div class="accommodation-buttons">
                  ${phoneButton}
                  ${whatsappButton}
                </div>
              `
              : ""
          }

        </div>

      `;

    }).join("");

}


/* =========================================
   طلب الخدمة
========================================= */

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


  if (
    !form ||
    !message ||
    !button
  ) {

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


    const text =
      await response.text();


    console.log(
      "Service request HTTP:",
      response.status
    );


    console.log(
      "Service request response:",
      text
    );


    if (!response.ok) {

      throw new Error(
        `HTTP ${response.status}: ${text}`
      );

    }


    message.textContent =
      "✅ تم إرسال طلبك بنجاح، سنتواصل معك قريبًا.";


    form.reset();


  } catch (error) {

    console.error(
      "❌ Service request error:",
      error
    );


    message.textContent =
      "❌ خطأ: " +
      error.message;


  } finally {

    button.disabled = false;

    button.textContent =
      "📩 إرسال الطلب";

  }

}


/* =========================================
   رسالة الخطأ
========================================= */

function showError(id, errorMessage = "") {

  const container =
    document.getElementById(id);


  if (!container) {
    return;
  }


  console.error(
    `Error in ${id}:`,
    errorMessage
  );


  container.innerHTML = `
    <p class="empty">
      ❌ خطأ في الاتصال
      <br>
      <small>
        ${escapeHTML(errorMessage)}
      </small>
    </p>
  `;

}


/* =========================================
   حماية HTML
========================================= */

function escapeHTML(value) {

  return String(value)

    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


/* =========================================
   تشغيل الموقع
========================================= */

document.addEventListener(
  "DOMContentLoaded",
  function () {

    console.log(
      "🌊 شمال المغرب - بدء التشغيل"
    );


    /* اختبار الإقامات */

    testSupabaseConnection();


    /* المواصلات */

    loadTransportServices();


    /* نموذج الطلب */

    const form =
      document.getElementById(
        "serviceRequestForm"
      );


    if (form) {

      form.addEventListener(
        "submit",
        submitServiceRequest
      );

    }

  }
);

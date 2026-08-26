/* =========================================
   شمال المغرب 🇲🇦
   Supabase Configuration
========================================= */

const SUPABASE_URL =
  "https://rbmttbxsezttysenbcwn.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_tVChEdNRQHs9lrYPjA4ajQ_heTXT2w";


/* =========================================
   Headers
========================================= */

function supabaseHeaders() {

  return {
    "apikey": SUPABASE_KEY,
    "Content-Type": "application/json"
  };

}


/* =========================================
   تحميل الإقامات
========================================= */

async function loadAccommodations() {

  try {

    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/accommodations?select=*`,
      {
        method: "GET",
        headers: supabaseHeaders()
      }
    );


    if (!response.ok) {

      const errorText =
        await response.text();

      throw new Error(
        `HTTP ${response.status} - ${errorText}`
      );

    }


    const data =
      await response.json();


    console.log(
      "Supabase accommodations:",
      data
    );


    displayAccommodations(data);


  } catch (error) {

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


/* =========================================
   تصنيف الإقامات
========================================= */

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

    container.innerHTML =
      `
        <p class="empty">
          ${emptyMessage}
        </p>
      `;

    return;

  }


  container.innerHTML =
    items.map(item => {


      /* -------------------------
         الهاتف
      ------------------------- */

      const phone =
        item.phone
          ? String(item.phone).trim()
          : "";


      /* -------------------------
         واتساب
      ------------------------- */

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


      /* -------------------------
         الصورة
      ------------------------- */

      const image =
        item.image_url
          ? `
            <img
              src="${escapeHTML(item.image_url)}"
              alt="${escapeHTML(
                item.name ||
                "صورة الإقامة"
              )}"
              class="accommodation-image"
              loading="lazy"
              onerror="
                this.style.display='none';
              "
            >
          `
          : "";


      /* -------------------------
         السعر
      ------------------------- */

      let price = "";


      if (
        item.price_per_night !== null &&
        item.price_per_night !== undefined &&
        item.price_per_night !== ""
      ) {

        price =
          `
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

        price =
          `
            <p>
              💰
              ${escapeHTML(
                String(item.price)
              )}
              درهم / ليلة
            </p>
          `;

      }


      /* -------------------------
         زر الهاتف
      ------------------------- */

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


      /* -------------------------
         زر واتساب
      ------------------------- */

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


      /* -------------------------
         زر الخريطة
      ------------------------- */

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


      /* -------------------------
         البطاقة
      ------------------------- */

      return `

        <div class="accommodation-card">

          ${image}

          <h3>
            ${escapeHTML(
              item.name ||
              "إقامة"
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
   تحميل خدمات المواصلات
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


    if (!response.ok) {

      const errorText =
        await response.text();

      throw new Error(
        `HTTP ${response.status} - ${errorText}`
      );

    }


    const data =
      await response.json();


    console.log(
      "Supabase transport:",
      data
    );


    displayTransportServices(data);


  } catch (error) {

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

function isTransportType(
  item,
  types
) {

  const possibleValues = [

    item.service_type,

    item.type,

    item.category,

    item.transport_type

  ];


  return possibleValues.some(value => {

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

    container.innerHTML =
      `
        <p class="empty">
          ${emptyMessage}
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
        item.description ||
        "";


      const city =
        item.city ||
        "";


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
   إرسال طلب الخدمة
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


    if (!response.ok) {

      const errorText =
        await response.text();


      throw new Error(
        `HTTP ${response.status}: ${errorText}`
      );

    }


    message.textContent =
      "✅ تم إرسال طلبك بنجاح، سنتواصل معك قريبًا.";


    form.reset();


  } catch (error) {

    console.error(
      "Service request error:",
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

function showError(id) {

  const container =
    document.getElementById(id);


  if (!container) {
    return;
  }


  container.innerHTML =
    `
      <p class="empty">
        تعذر تحميل البيانات حالياً.
      </p>
    `;

}


/* =========================================
   حماية HTML
========================================= */

function escapeHTML(value) {

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


/* =========================================
   تشغيل الموقع
========================================= */

document.addEventListener(
  "DOMContentLoaded",
  function () {

    /* الإقامات */
    loadAccommodations();


    /* المواصلات */
    loadTransportServices();


    /* نموذج طلب الخدمة */

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

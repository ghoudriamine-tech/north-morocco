const SUPABASE_URL =
  "https://rbmttbxsezttysenbcwn.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_tVChEdNRQHs9lrYPjA4ajQ_heTXT2x2";


async function loadAccommodations() {

  const headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json"
  };

  try {

    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/accommodations?select=*`,
      {
        method: "GET",
        headers: headers
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
      "Supabase data:",
      data
    );

    displayAccommodations(data);

  } catch (error) {

    console.error(
      "Supabase error:",
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


/* =========================
   عرض الإقامات
========================= */

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


  if (items.length === 0) {

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

      /* =====================
         الهاتف
      ===================== */

      const phone =
        item.phone
          ? String(item.phone).trim()
          : "";


      /* =====================
         واتساب
      ===================== */

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


      /* =====================
         الصورة
      ===================== */

      const image =
        item.image_url
          ? `
            <img
              src="${escapeHTML(
                item.image_url
              )}"
              alt="${escapeHTML(
                item.name ||
                "صورة الإقامة"
              )}"
              class="accommodation-image"
              loading="lazy"
              onerror="
                this.style.display='none'
              "
            >
          `
          : "";


      /* =====================
         السعر
      ===================== */

      const price =
        item.price_per_night
          ? `
            <p>
              💰
              ${escapeHTML(
                String(
                  item.price_per_night
                )
              )}
              درهم / ليلة
            </p>
          `
          : (
              item.price
                ? `
                  <p>
                    💰
                    ${escapeHTML(
                      String(
                        item.price
                      )
                    )}
                    درهم / ليلة
                  </p>
                `
                : ""
            );


      /* =====================
         الهاتف
      ===================== */

      const phoneButton =
        phone
          ? `
            <a
              href="tel:${escapeHTML(
                phone
              )}"
              class="btn">

              📞 اتصال

            </a>
          `
          : "";


      /* =====================
         واتساب
      ===================== */

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


      /* =====================
         الخريطة
      ===================== */

      const mapButton =
        item.map_url
          ? `
            <a
              href="${escapeHTML(
                item.map_url
              )}"
              class="btn"
              target="_blank"
              rel="noopener">

              📍 الموقع

            </a>
          `
          : "";


      /* =====================
         البطاقة
      ===================== */

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
                  ${escapeHTML(
                    item.city
                  )}
                </p>
              `
              : ""
          }


          ${
            item.address
              ? `
                <p>
                  📌
                  ${escapeHTML(
                    item.address
                  )}
                </p>
              `
              : ""
          }


          ${
            item.description
              ? `
                <p>
                  ${escapeHTML(
                    item.description
                  )}
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
                <div
                  class="accommodation-buttons">

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


/* =========================
   رسالة الخطأ
========================= */

function showError(
  id,
  errorMessage = ""
) {

  const container =
    document.getElementById(id);

  if (!container) {
    return;
  }


  console.error(
    `Error in ${id}:`,
    errorMessage
  );


  container.innerHTML =
    `
      <p class="empty">
        تعذر تحميل البيانات حالياً.
      </p>
    `;
}


/* =========================
   حماية النصوص
========================= */

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


/* =========================
   تشغيل الموقع
========================= */

document.addEventListener(
  "DOMContentLoaded",
  function () {

    loadAccommodations();

  }
);
/* =========================
   إرسال طلب الخدمة
========================= */

async function submitServiceRequest(event) {

  event.preventDefault();

  const form =
    document.getElementById("serviceRequestForm");

  const message =
    document.getElementById("requestMessage");

  const button =
    document.getElementById("submitRequestBtn");

  if (!form || !message || !button) {
    return;
  }

  const requesterName =
    document.getElementById("requester_name").value.trim();

  const phone =
    document.getElementById("phone").value.trim();

  const whatsapp =
    document.getElementById("whatsapp").value.trim();

  const serviceType =
    document.getElementById("service_type").value;

  const serviceId =
    document.getElementById("service_id").value;

  const requestDate =
    document.getElementById("request_date").value;

  const notes =
    document.getElementById("notes").value.trim();


  if (!requesterName || !serviceType || !serviceId) {

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
            service_type: serviceType,
            service_id: Number(serviceId),
            requester_name: requesterName,
            phone: phone || null,
            whatsapp: whatsapp || null,
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
  "❌ خطأ: " + error.message;


  } finally {

    button.disabled = false;

    button.textContent =
      "📩 إرسال الطلب";

  }
}


/* =========================
   تشغيل نموذج الطلب
========================= */

document.addEventListener(
  "DOMContentLoaded",
  function () {

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

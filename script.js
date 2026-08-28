/* =========================================
   🌊 شمال المغرب 🇲🇦
   Supabase
   النسخة المحسنة
========================================= */

const SUPABASE_URL =
  "https://rbmttbxsezttysenbcwn.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_tVChEdNRQHs9lrYPjA4ajQ_heTXT2w";


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
      `${SUPABASE_URL}/rest/v1/accommodations?select=id&limit=1`,
      {
        method: "GET",
        headers: supabaseHeaders()
      }
    );

    console.log(
      "Supabase status:",
      response.status
    );

    if (!response.ok) {

      const errorText =
        await response.text();

      throw new Error(
        `HTTP ${response.status}: ${errorText}`
      );
    }

    console.log(
      "🟢 الاتصال بـ Supabase ناجح."
    );

  } catch (error) {

    console.error(
      "🔴 Supabase connection error:",
      error
    );

  }
}


/* =========================================
   تحميل الإقامات
   + مقدمي الخدمات
   + التقييمات
========================================= */

async function loadAccommodations() {

  try {

    const [
      accommodationsResponse,
      providersResponse,
      reviewsResponse
    ] = await Promise.all([

      fetch(
        `${SUPABASE_URL}/rest/v1/accommodations?select=*`,
        {
          method: "GET",
          headers: supabaseHeaders()
        }
      ),

      fetch(
        `${SUPABASE_URL}/rest/v1/providers?select=*`,
        {
          method: "GET",
          headers: supabaseHeaders()
        }
      ),

      fetch(
        `${SUPABASE_URL}/rest/v1/reviews?select=*`,
        {
          method: "GET",
          headers: supabaseHeaders()
        }
      )

    ]);


    if (!accommodationsResponse.ok) {

      const errorText =
        await accommodationsResponse.text();

      throw new Error(
        `Accommodations HTTP ${accommodationsResponse.status}: ${errorText}`
      );
    }


    const accommodations =
      await accommodationsResponse.json();


    let providers = [];
    let reviews = [];


    if (providersResponse.ok) {

      providers =
        await providersResponse.json();

    }
    else {

      console.warn(
        "⚠️ تعذر تحميل مقدمي الخدمات."
      );

    }


    if (reviewsResponse.ok) {

      reviews =
        await reviewsResponse.json();

    }
    else {

      console.warn(
        "⚠️ تعذر تحميل التقييمات."
      );

    }


    console.log(
      "🟢 Supabase accommodations:",
      accommodations
    );


    console.log(
      "🟢 Supabase providers:",
      providers
    );


    console.log(
      "🟢 Supabase reviews:",
      reviews
    );


    displayAccommodations(
      accommodations,
      providers,
      reviews
    );


  } catch (error) {

    console.error(
      "🔴 Accommodations error:",
      error
    );

    showError("apartmentsList");
    showError("hotelsList");
    showError("riadsList");

  }
}


/* =========================================
   تصنيف الإقامات
========================================= */

function displayAccommodations(
  data,
  providers,
  reviews
) {

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
    "لا توجد شقق مفروشة حالياً.",
    providers,
    reviews
  );


  displayList(
    "hotelsList",
    hotels,
    "لا توجد فنادق حالياً.",
    providers,
    reviews
  );


  displayList(
    "riadsList",
    riads,
    "لا توجد رياضات حالياً.",
    providers,
    reviews
  );

}


/* =========================================
   عرض الإقامات
========================================= */

function displayList(
  id,
  items,
  emptyMessage,
  providers = [],
  reviews = []
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


      /* =================================
         الصورة
      ================================= */

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
              onerror="
                this.style.display='none';
              "
            >
          `
          : "";


      /* =================================
         السعر
      ================================= */

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


      /* =================================
         الاتصال
      ================================= */

      const phoneButton =
        phone
          ? `
            <a
              href="tel:${escapeHTML(phone)}"
              class="btn"
              aria-label="اتصال">

              📞

            </a>
          `
          : "";


      /* =================================
         واتساب
      ================================= */

      const whatsappButton =
        whatsappNumber
          ? `
            <a
              href="https://wa.me/${whatsappNumber}"
              class="btn whatsapp-accommodation"
              target="_blank"
              rel="noopener"
              aria-label="واتساب">

              💬

            </a>
          `
          : "";


      /* =================================
         الموقع
      ================================= */

      const mapButton =
        item.map_url
          ? `
            <a
              href="${escapeHTML(item.map_url)}"
              class="btn"
              target="_blank"
              rel="noopener"
              aria-label="الموقع">

              📍

            </a>
          `
          : "";


      /* =================================
         مقدم الخدمة
      ================================= */

      const provider =
        providers.find(
          p =>
            String(p.id) ===
            String(item.provider_id)
        );


      const providerHTML =
        provider
          ? `
            <div
              id="provider-${item.id}"
              class="card-toggle-section">

              <div class="provider-details">

                <h4>
                  🏢 ${escapeHTML(
                    provider.name || "مقدم الخدمة"
                  )}
                </h4>

                ${
                  provider.service_type
                    ? `
                      <p>
                        🏷️
                        ${escapeHTML(
                          provider.service_type
                        )}
                      </p>
                    `
                    : ""
                }

                ${
                  provider.city
                    ? `
                      <p>
                        📍
                        ${escapeHTML(
                          provider.city
                        )}
                      </p>
                    `
                    : ""
                }

                ${
                  provider.address
                    ? `
                      <p>
                        📌
                        ${escapeHTML(
                          provider.address
                        )}
                      </p>
                    `
                    : ""
                }

                ${
                  provider.description
                    ? `
                      <p>
                        ${escapeHTML(
                          provider.description
                        )}
                      </p>
                    `
                    : ""
                }

                ${
                  provider.phone
                    ? `
                      <p>
                        📞
                        ${escapeHTML(
                          provider.phone
                        )}
                      </p>
                    `
                    : ""
                }

              </div>

            </div>
          `
          : `
            <div
              id="provider-${item.id}"
              class="card-toggle-section">

              <div class="provider-details">

                <p>
                  لا توجد معلومات مقدم الخدمة حالياً.
                </p>

              </div>

            </div>
          `;


      const providerButton =
        `
          <button
            type="button"
            class="btn card-toggle-btn"
            aria-label="مقدم الخدمة"
            aria-expanded="false"
            onclick="toggleCardSection(
              'provider-${item.id}',
              this
            )">

            🏢

          </button>
        `;


      /* =================================
         التقييمات
      ================================= */

      const itemReviews =
        reviews.filter(review =>
          String(review.service_type || "")
            .trim()
            .toLowerCase() === "accommodation"
          &&
          String(review.service_id) ===
            String(item.id)
        );


      const reviewCount =
        itemReviews.length;


      const ratingTotal =
        itemReviews.reduce(
          (sum, review) =>
            sum +
            Number(review.rating || 0),
          0
        );


      const averageRating =
        reviewCount
          ? ratingTotal / reviewCount
          : 0;


      const roundedRating =
        Math.round(
          averageRating
        );


      const averageStars =
        makeStars(roundedRating);


      const reviewsHTML =
        `
          <div
            id="reviews-${item.id}"
            class="card-toggle-section">

            <div class="card-reviews">

              <div class="reviews-summary">

                <strong>
                  ⭐ التقييم
                </strong>

                <span class="reviews-average">

                  ${
                    reviewCount
                      ? `
                        ${averageStars}
                        ${averageRating.toFixed(1)}/5
                        ·
                        ${reviewCount}
                        ${reviewCount === 1 ? "تقييم" : "تقييمات"}
                      `
                      : `
                        لا توجد تقييمات بعد
                      `
                  }

                </span>

              </div>


              ${
                itemReviews.length
                  ? itemReviews.map(review => {

                      const rating =
                        Math.max(
                          0,
                          Math.min(
                            5,
                            Number(review.rating || 0)
                          )
                        );


                      return `
                        <div class="review-item">

                          <strong>
                            ${escapeHTML(
                              review.reviewer_name ||
                              "مستخدم"
                            )}
                          </strong>

                          <div class="review-stars">
                            ${makeStars(rating)}
                          </div>

                          ${
                            review.comment
                              ? `
                                <div class="review-comment-display">
                                  💬
                                  ${escapeHTML(
                                    review.comment
                                  )}
                                </div>
                              `
                              : ""
                          }

                        </div>
                      `;

                    }).join("")
                  : ""
              }

            </div>

          </div>
        `;


      const reviewButton =
        `
          <button
            type="button"
            class="btn card-toggle-btn"
            aria-label="التقييم"
            aria-expanded="false"
            onclick="toggleCardSection(
              'reviews-${item.id}',
              this
            )">

            ⭐

          </button>
        `;


      /* =================================
         الطلب
      ================================= */

      const requestButton =
        `
          <button
            type="button"
            class="btn card-toggle-btn"
            aria-label="طلب الخدمة"
            onclick="selectService(
              'accommodation',
              '${escapeHTML(item.id)}',
              '${escapeJS(item.name || "إقامة")}'
            )">

            📋

          </button>
        `;


      /* =================================
         البطاقة
      ================================= */

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


          <div class="accommodation-buttons">

            ${phoneButton}

            ${whatsappButton}

            ${mapButton}

            ${providerButton}

            ${reviewButton}

            ${requestButton}

          </div>


          ${providerHTML}

          ${reviewsHTML}

        </div>

      `;

    }).join("");

}


/* =========================================
   فتح / إغلاق قسم داخل البطاقة
========================================= */

function toggleCardSection(
  sectionId,
  button
) {

  const section =
    document.getElementById(sectionId);


  if (!section) {
    return;
  }


  const isOpen =
    section.classList.contains("show");


  section.classList.toggle(
    "show"
  );


  if (button) {

    button.setAttribute(
      "aria-expanded",
      String(!isOpen)
    );

  }

}


/* =========================================
   النجوم
========================================= */

function makeStars(rating) {

  const value =
    Math.max(
      0,
      Math.min(
        5,
        Math.round(
          Number(rating) || 0
        )
      )
    );


  return "★".repeat(value) +
         "☆".repeat(5 - value);

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
      "🟢 Supabase transport:",
      data
    );


    displayTransportServices(data);


  } catch (error) {

    console.error(
      "🔴 Transport error:",
      error
    );


    showError("carRentalList");
    showError("taxiList");
    showError("busList");

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
              onerror="
                this.style.display='none';
              "
            >
          `
          : "";


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


      const whatsappButton =
        whatsappNumber
          ? `
            <a
              href="https://wa.me/${whatsappNumber}"
              class="btn whatsapp-accommodation"
              target="_blank"
              rel="noopener">

              💬

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

              📍

            </a>
          `
          : "";


      const requestButton =
        `
          <button
            type="button"
            class="btn card-toggle-btn"
            onclick="selectService(
              'transport',
              '${escapeHTML(item.id)}',
              '${escapeJS(name)}'
            )">

            📋

          </button>
        `;


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
   اختيار الخدمة تلقائياً
========================================= */

function selectService(
  serviceType,
  serviceId,
  serviceName
) {

  const type =
    document.getElementById(
      "service_type"
    );


  const id =
    document.getElementById(
      "service_id"
    );


  const notes =
    document.getElementById(
      "notes"
    );


  if (!type || !id) {

    console.error(
      "❌ حقول الخدمة غير موجودة في نموذج الطلب."
    );

    return;

  }


  type.value =
    String(serviceType).trim();


  id.value =
    String(serviceId).trim();


  if (notes) {

    notes.value =
      "أرغب في طلب خدمة: " +
      String(serviceName || "").trim();

  }


  console.log(
    "🟢 تم اختيار الخدمة تلقائياً:",
    {
      service_type: type.value,
      service_id: id.value,
      service_name: serviceName
    }
  );


  /* =================================
     إظهار نموذج الطلب العام
  ================================= */

  const requestSection =
    document.getElementById(
      "request"
    );


  if (requestSection) {

    requestSection.classList.add(
      "show"
    );

    requestSection.classList.add(
      "visible-request"
    );

    requestSection.classList.remove(
      "hidden-request"
    );


    requestSection.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

  }

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


  const requesterNameElement =
    document.getElementById(
      "requester_name"
    );


  const phoneElement =
    document.getElementById(
      "phone"
    );


  const whatsappElement =
    document.getElementById(
      "whatsapp"
    );


  const serviceTypeElement =
    document.getElementById(
      "service_type"
    );


  const serviceIdElement =
    document.getElementById(
      "service_id"
    );


  const requestDateElement =
    document.getElementById(
      "request_date"
    );


  const notesElement =
    document.getElementById(
      "notes"
    );


  if (
    !requesterNameElement ||
    !serviceTypeElement ||
    !serviceIdElement
  ) {

    message.textContent =
      "❌ نموذج الطلب غير مكتمل.";

    return;

  }


  const requesterName =
    requesterNameElement.value.trim();


  const phone =
    phoneElement
      ? phoneElement.value.trim()
      : "";


  const whatsapp =
    whatsappElement
      ? whatsappElement.value.trim()
      : "";


  const serviceType =
    serviceTypeElement.value.trim();


  const serviceId =
    serviceIdElement.value.trim();


  const requestDate =
    requestDateElement
      ? requestDateElement.value
      : "";


  const notes =
    notesElement
      ? notesElement.value.trim()
      : "";


  if (
    !requesterName ||
    !serviceType ||
    !serviceId
  ) {

    message.textContent =
      "⚠️ يرجى اختيار الخدمة وملء الاسم.";

    return;

  }


  button.disabled =
    true;


  button.textContent =
    "⏳ جاري إرسال الطلب...";


  message.textContent =
    "";


  try {

    const response =
      await fetch(
        `${SUPABASE_URL}/rest/v1/service_requests`,
        {
          method: "POST",

          headers: {
            "apikey":
              SUPABASE_KEY,

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


    if (serviceTypeElement) {
      serviceTypeElement.value = "";
    }


    if (serviceIdElement) {
      serviceIdElement.value = "";
    }


  } catch (error) {

    console.error(
      "🔴 Service request error:",
      error
    );


    message.textContent =
      "❌ تعذر إرسال الطلب حالياً. يرجى المحاولة مرة أخرى.";

  } finally {

    button.disabled =
      false;


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
   حماية النص داخل onclick
========================================= */

function escapeJS(value) {

  return String(value)
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/\r?\n/g, " ");

}


/* =========================================
   تشغيل الموقع
========================================= */

document.addEventListener(
  "DOMContentLoaded",
  function () {

    testSupabaseConnection();

    loadAccommodations();

    loadTransportServices();


    /* =================================
       إخفاء نموذج الطلب في البداية
    ================================= */

    const requestSection =
      document.getElementById(
        "request"
      );


    if (requestSection) {

      requestSection.classList.add(
        "hidden-request"
      );

      requestSection.classList.remove(
        "visible-request"
      );

    }


    /* =================================
       نموذج طلب الخدمة
    ================================= */

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

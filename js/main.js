/* =========================================
   🌊 شمال المغرب
   MAIN.JS
   تشغيل الموقع + خدمات الموقع
========================================= */


/* =========================================
   تشغيل الموقع
========================================= */

document.addEventListener("DOMContentLoaded", () => {

  console.log("🌊 شمال المغرب — الموقع بدأ التشغيل");

  /* الإقامات */
  if (typeof loadAccommodations === "function") {
    loadAccommodations();
  }

  /* المواصلات */
  if (typeof loadTransportServices === "function") {
    loadTransportServices();
  }

  /* الرحلات والمرشدون */
  if (typeof loadActivities === "function") {
    loadActivities();
  }

  /* البحث */
  initGlobalSearch();

  /* طلب الخدمة */
  initServiceRequest();

  /* مقدم الخدمة */
  initProviderApplication();

});


/* =========================================
   خدمات الموقع
   فتح وإغلاق البطاقات
========================================= */

function toggleActionCard(card) {

  if (!card) return;

  const isOpen =
    card.classList.contains("card-open");

  /*
     إغلاق باقي البطاقات
  */
  document
    .querySelectorAll(".action-card.card-open")
    .forEach(openCard => {

      if (openCard !== card) {
        openCard.classList.remove("card-open");
      }

    });

  /*
     فتح / إغلاق البطاقة الحالية
  */
  if (isOpen) {
    card.classList.remove("card-open");
  } else {
    card.classList.add("card-open");
  }

}


/* =========================================
   📋 طلب الخدمة
========================================= */

function initServiceRequest() {

  const form =
    document.getElementById(
      "serviceRequestForm"
    );

  if (!form) return;

  /*
     منع تكرار ربط النموذج
  */
  if (form.dataset.initialized === "true") {
    return;
  }

  form.dataset.initialized = "true";

  form.addEventListener(
    "submit",
    submitServiceRequest
  );

}


/* =========================================
   اختيار خدمة من البطاقة
========================================= */

function selectService(
  type,
  id,
  name
) {

  const serviceType =
    document.getElementById(
      "service_type"
    );

  const serviceId =
    document.getElementById(
      "service_id"
    );

  const notes =
    document.getElementById(
      "notes"
    );

  if (!serviceType || !serviceId) {
    console.error(
      "❌ حقول طلب الخدمة غير موجودة"
    );
    return;
  }

  serviceType.value =
    String(type || "");

  serviceId.value =
    String(id || "");

  if (notes) {

    notes.value =
      `أرغب في طلب خدمة: ${String(
        name || ""
      )}`;

  }

  /*
     فتح بطاقة طلب الخدمة
  */

  const cards =
    document.querySelectorAll(
      ".action-card"
    );

  cards.forEach(card => {

    const title =
      card.querySelector("h3");

    if (
      title &&
      title.textContent.includes(
        "طلب خدمة"
      )
    ) {

      card.classList.add(
        "card-open"
      );

      card.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    }

  });

}


/* =========================================
   إرسال طلب الخدمة
========================================= */

async function submitServiceRequest(e) {

  e.preventDefault();

  const form =
    document.getElementById(
      "serviceRequestForm"
    );

  const msg =
    document.getElementById(
      "requestMessage"
    );

  const btn =
    document.getElementById(
      "submitRequestBtn"
    );

  if (!form || !msg || !btn) {
    return;
  }


  const value = id => {

    const element =
      document.getElementById(id);

    return element
      ? element.value.trim()
      : "";

  };


  const serviceId =
    Number(
      value("service_id")
    );


  const data = {

    requester_name:
      value("requester_name"),

    phone:
      value("phone") || null,

    whatsapp:
      value("whatsapp") || null,

    service_type:
      value("service_type"),

    service_id:
      serviceId,

    request_date:
      value("request_date") || null,

    notes:
      value("notes") || null

  };


  /* التحقق */

  if (!data.requester_name) {

    msg.textContent =
      "⚠️ يرجى كتابة الاسم.";

    return;
  }


  if (!data.service_type) {

    msg.textContent =
      "⚠️ يرجى اختيار نوع الخدمة.";

    return;
  }


  if (
    !Number.isInteger(serviceId) ||
    serviceId <= 0
  ) {

    msg.textContent =
      "⚠️ يرجى اختيار الخدمة أولاً.";

    return;
  }


  btn.disabled = true;

  btn.textContent =
    "⏳ جاري الإرسال...";

  msg.textContent = "";


  const controller =
    new AbortController();

  const timeout =
    setTimeout(() => {
      controller.abort();
    }, 10000);


  try {

    const response =
      await fetch(
        `${SUPABASE_URL}/rest/v1/service_requests`,
        {
          method: "POST",

          headers: {
            ...supabaseHeaders(),
            Prefer: "return=minimal"
          },

          body:
            JSON.stringify(data),

          signal:
            controller.signal
        }
      );


    if (!response.ok) {

      throw new Error(
        await response.text()
      );

    }


    msg.textContent =
      "✅ تم إرسال طلبك بنجاح، سنتواصل معك قريبًا.";

    form.reset();


  } catch (error) {

    console.error(
      "Service request error:",
      error
    );


    if (
      error.name ===
      "AbortError"
    ) {

      msg.textContent =
        "❌ انتهت مهلة إرسال الطلب. يرجى المحاولة مرة أخرى.";

    } else {

      msg.textContent =
        "❌ تعذر إرسال الطلب حاليًا. يرجى المحاولة مرة أخرى.";

    }

  } finally {

    clearTimeout(timeout);

    btn.disabled = false;

    btn.textContent =
      "📩 إرسال";

  }

}


/* =========================================
   🏢 مقدم الخدمة
========================================= */

function initProviderApplication() {

  const form =
    document.getElementById(
      "providerApplicationForm"
    );

  if (!form) return;

  if (
    form.dataset.initialized === "true"
  ) {
    return;
  }

  form.dataset.initialized =
    "true";

  form.addEventListener(
    "submit",
    submitProviderApplication
  );

}


/* =========================================
   إرسال طلب مقدم الخدمة
========================================= */

async function submitProviderApplication(e) {

  e.preventDefault();

  const form =
    document.getElementById(
      "providerApplicationForm"
    );

  const msg =
    document.getElementById(
      "providerMessage"
    );

  const btn =
    document.getElementById(
      "submitProviderBtn"
    );

  if (!form || !msg || !btn) {
    return;
  }


  const value = id => {

    const element =
      document.getElementById(id);

    return element
      ? element.value.trim()
      : "";

  };


  const data = {

    provider_name:
      value("provider_name"),

    service_type:
      value(
        "provider_service_type"
      ),

    city:
      value("provider_city"),

    address:
      value("provider_address") ||
      null,

    description:
      value(
        "provider_description"
      ) || null,

    phone:
      value("provider_phone") ||
      null,

    whatsapp:
      value("provider_whatsapp") ||
      null,

    image_url:
      value(
        "provider_image_url"
      ) || null,

    map_url:
      value(
        "provider_map_url"
      ) || null

  };


  /* التحقق */

  if (!data.provider_name) {

    msg.textContent =
      "⚠️ يرجى كتابة اسم مقدم الخدمة.";

    return;
  }


  if (!data.service_type) {

    msg.textContent =
      "⚠️ يرجى اختيار نوع الخدمة.";

    return;
  }


  if (!data.city) {

    msg.textContent =
      "⚠️ يرجى كتابة المدينة.";

    return;
  }


  btn.disabled = true;

  btn.textContent =
    "⏳ جاري الإرسال...";

  msg.textContent = "";


  const controller =
    new AbortController();

  const timeout =
    setTimeout(() => {
      controller.abort();
    }, 10000);


  try {

    const response =
      await fetch(
        `${SUPABASE_URL}/rest/v1/provider_applications`,
        {
          method: "POST",

          headers: {
            ...supabaseHeaders(),
            Prefer: "return=minimal"
          },

          body:
            JSON.stringify(data),

          signal:
            controller.signal
        }
      );


    if (!response.ok) {

      throw new Error(
        await response.text()
      );

    }


    msg.textContent =
      "✅ تم إرسال طلبك بنجاح، سنراجعه قبل نشر الخدمة.";

    form.reset();


  } catch (error) {

    console.error(
      "Provider application error:",
      error
    );


    if (
      error.name ===
      "AbortError"
    ) {

      msg.textContent =
        "❌ انتهت مهلة الإرسال. يرجى المحاولة مرة أخرى.";

    } else {

      msg.textContent =
        "❌ تعذر إرسال الطلب حاليًا.";

    }

  } finally {

    clearTimeout(timeout);

    btn.disabled = false;

    btn.textContent =
      "📩 إرسال";

  }

}


/* =========================================
   🔎 البحث
========================================= */

function initGlobalSearch() {

  const search =
    document.getElementById(
      "globalSearch"
    );

  if (!search) return;

  if (
    search.dataset.initialized ===
    "true"
  ) {
    return;
  }

  search.dataset.initialized =
    "true";


  search.addEventListener(
    "input",
    performGlobalSearch
  );

}


/* =========================================
   تنفيذ البحث
========================================= */

function performGlobalSearch() {

  const search =
    document.getElementById(
      "globalSearch"
    );

  const message =
    document.getElementById(
      "searchMessage"
    );

  if (!search) return;


  const query =
    search.value
      .trim()
      .toLowerCase();


  /*
     إذا كان البحث فارغًا
  */

  if (!query) {

    clearSearchResults();

    if (message) {
      message.textContent = "";
    }

    return;
  }


  let found = 0;


  /*
     البحث في جميع البطاقات
  */

  const cards =
    document.querySelectorAll(
      ".accommodation-card"
    );


  cards.forEach(card => {

    /*
       نستثني بطاقات خدمات الموقع
    */

    if (
      card.classList.contains(
        "action-card"
      )
    ) {
      return;
    }


    const text =
      card.textContent
        .toLowerCase();


    if (
      text.includes(query)
    ) {

      card.style.display = "";

      found++;

    } else {

      card.style.display =
        "none";

    }

  });


  /*
     رسالة البحث
  */

  if (message) {

    if (found > 0) {

      message.textContent =
        `🔎 تم العثور على ${found} خدمة.`;

    } else {

      message.textContent =
        "❌ لم يتم العثور على خدمة مطابقة.";

    }

  }

}


/* =========================================
   إلغاء البحث
========================================= */

function clearSearchResults() {

  document
    .querySelectorAll(
      ".accommodation-card"
    )
    .forEach(card => {

      if (
        !card.classList.contains(
          "action-card"
        )
      ) {

        card.style.display =
          "";

      }

    });

}


/* =========================================
   أدوات مساعدة
========================================= */

if (
  typeof window.escapeJS !==
  "function"
) {

  window.escapeJS = function(value) {

    return String(
      value ?? ""
    )
      .replace(/\\/g, "\\\\")
      .replace(/'/g, "\\'")
      .replace(/"/g, '\\"')
      .replace(/\n/g, "\\n")
      .replace(/\r/g, "\\r");

  };

}

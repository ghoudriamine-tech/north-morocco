/* =========================================
   🌊 شمال المغرب
   📋 طلبات الخدمة
========================================= */


/* =========================================
   اختيار الخدمة
========================================= */

function selectService(type, id, name) {

  const serviceType =
    document.getElementById("service_type");

  const serviceId =
    document.getElementById("service_id");

  const notes =
    document.getElementById("notes");

  if (!serviceType || !serviceId) {
    console.error("❌ حقول طلب الخدمة غير موجودة");
    return;
  }


  /* تعبئة البيانات */

  serviceType.value =
    String(type || "");

  serviceId.value =
    String(id || "");

  if (notes) {
    notes.value =
      `أرغب في طلب خدمة: ${String(name || "")}`;
  }


  /* =====================================
     فتح بطاقة طلب الخدمة
  ===================================== */

  const actionCards =
    document.querySelectorAll(
      "#services-actions .action-card"
    );

  let requestCard = null;

  actionCards.forEach(card => {

    const title =
      card.querySelector("h3");

    if (
      title &&
      title.textContent.includes("طلب خدمة")
    ) {
      requestCard = card;
    }

  });


  if (requestCard) {

    /* إغلاق البطاقات الأخرى */

    actionCards.forEach(card => {
      if (card !== requestCard) {
        card.classList.remove("card-open");
      }
    });


    /* فتح طلب الخدمة */

    requestCard.classList.add(
      "card-open"
    );


    /* التمرير إليه */

    setTimeout(() => {

      requestCard.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    }, 100);

  }

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
    console.error(
      "❌ نموذج طلب الخدمة غير موجود"
    );
    return;
  }


  /* قراءة القيم */

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


  /* التحقق من البيانات */

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


  /* بدء الإرسال */

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

      const errorText =
        await response.text();

      throw new Error(
        errorText ||
        `HTTP ${response.status}`
      );

    }


    /* نجاح */

    msg.textContent =
      "✅ تم إرسال طلبك بنجاح، سنتواصل معك قريبًا.";

    form.reset();


  } catch (error) {

    console.error(
      "❌ Service request error:",
      error
    );


    if (
      error.name === "AbortError"
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
   تشغيل نموذج طلب الخدمة
========================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    const form =
      document.getElementById(
        "serviceRequestForm"
      );

    if (!form) return;


    /*
       منع تكرار ربط النموذج
    */

    if (
      form.dataset.initialized ===
      "true"
    ) {
      return;
    }


    form.dataset.initialized =
      "true";


    form.addEventListener(
      "submit",
      submitServiceRequest
    );

  }
);

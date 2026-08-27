/* =========================================
   📋 شمال المغرب
   نظام طلب الخدمة
   النسخة المحسنة للسرعة والاستقرار
========================================= */


/* =========================================
   اختيار الخدمة تلقائيًا
   عند الضغط على:
   📋 اطلب هذه الخدمة
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


  /* التأكد من وجود الحقول */

  if (!type || !id) {
    return;
  }


  /* تحديد نوع الخدمة */

  type.value =
    String(serviceType || "");


  /* تحديد رقم الخدمة تلقائيًا */

  id.value =
    String(serviceId || "");


  /* إضافة اسم الخدمة إلى الملاحظات */

  if (notes) {

    notes.value =
      "أرغب في طلب خدمة: " +
      String(serviceName || "");

  }


  /* الانتقال إلى نموذج الطلب */

  const requestSection =
    document.getElementById(
      "request"
    );


  if (requestSection) {

    requestSection.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

  }

}


/* =========================================
   إرسال طلب الخدمة
========================================= */

async function submitServiceRequest(
  event
) {

  /* منع إعادة تحميل الصفحة */

  event.preventDefault();


  /* =======================================
     الحصول على عناصر النموذج
  ======================================= */

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


  /* إذا كان أحد العناصر غير موجود */

  if (
    !form ||
    !message ||
    !button
  ) {

    console.error(
      "Service request form elements not found."
    );

    return;

  }


  /* =======================================
     قراءة بيانات المستخدم
  ======================================= */

  const requesterNameInput =
    document.getElementById(
      "requester_name"
    );

  const phoneInput =
    document.getElementById(
      "phone"
    );

  const whatsappInput =
    document.getElementById(
      "whatsapp"
    );

  const serviceTypeInput =
    document.getElementById(
      "service_type"
    );

  const serviceIdInput =
    document.getElementById(
      "service_id"
    );

  const requestDateInput =
    document.getElementById(
      "request_date"
    );

  const notesInput =
    document.getElementById(
      "notes"
    );


  /* التأكد من وجود الحقول الأساسية */

  if (
    !requesterNameInput ||
    !serviceTypeInput ||
    !serviceIdInput
  ) {

    message.textContent =
      "❌ تعذر قراءة بيانات الطلب.";

    return;

  }


  /* =======================================
     تنظيف البيانات
  ======================================= */

  const requesterName =
    requesterNameInput.value.trim();


  const phone =
    phoneInput
      ? phoneInput.value.trim()
      : "";


  const whatsapp =
    whatsappInput
      ? whatsappInput.value.trim()
      : "";


  const serviceType =
    serviceTypeInput.value.trim();


  const serviceId =
    serviceIdInput.value.trim();


  const requestDate =
    requestDateInput
      ? requestDateInput.value
      : "";


  const notes =
    notesInput
      ? notesInput.value.trim()
      : "";


  /* =======================================
     التحقق من البيانات المطلوبة
  ======================================= */

  if (!requesterName) {

    message.textContent =
      "⚠️ يرجى كتابة الاسم.";

    requesterNameInput.focus();

    return;

  }


  if (!serviceType) {

    message.textContent =
      "⚠️ يرجى اختيار نوع الخدمة.";

    serviceTypeInput.focus();

    return;

  }


  if (!serviceId) {

    message.textContent =
      "⚠️ يرجى اختيار الخدمة أولاً.";

    serviceIdInput.focus();

    return;

  }


  /* =======================================
     التأكد من أن رقم الخدمة صالح
  ======================================= */

  const numericServiceId =
    Number(serviceId);


  if (
    !Number.isInteger(
      numericServiceId
    ) ||
    numericServiceId <= 0
  ) {

    message.textContent =
      "⚠️ رقم الخدمة غير صالح.";

    return;

  }


  /* =======================================
     منع الضغط المتكرر
  ======================================= */

  if (
    button.disabled
  ) {

    return;

  }


  button.disabled =
    true;


  button.textContent =
    "⏳ جاري إرسال الطلب...";


  message.textContent =
    "";


  /* =======================================
     إنشاء مهلة قصوى
     حتى لا يبقى الزر معلقًا
  ======================================= */

  const controller =
    new AbortController();


  const timeout =
    setTimeout(
      () => {

        controller.abort();

      },
      10000
    );


  /* =======================================
     إرسال الطلب إلى Supabase
  ======================================= */

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
              numericServiceId,

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

          }),

          signal:
            controller.signal

        }
      );


    /* =====================================
       إلغاء المؤقت بعد انتهاء الطلب
    ===================================== */

    clearTimeout(
      timeout
    );


    /* =====================================
       فحص نتيجة Supabase
    ===================================== */

    if (!response.ok) {

      const errorText =
        await response.text();


      throw new Error(
        `HTTP ${response.status}: ${errorText}`
      );

    }


    /* =====================================
       نجاح إرسال الطلب
    ===================================== */

    message.textContent =
      "✅ تم إرسال طلبك بنجاح، سنتواصل معك قريبًا.";


    /* تنظيف النموذج */

    form.reset();


  } catch (error) {

    /* التأكد من إلغاء المؤقت */

    clearTimeout(
      timeout
    );


    console.error(
      "Service request error:",
      error
    );


    /* =====================================
       إذا انتهت المهلة
    ===================================== */

    if (
      error.name ===
      "AbortError"
    ) {

      message.textContent =
        "❌ انتهت مهلة إرسال الطلب. يرجى المحاولة مرة أخرى.";

    } else {

      /* ===================================
         خطأ آخر
      =================================== */

      message.textContent =
        "❌ تعذر إرسال الطلب حاليًا. يرجى المحاولة مرة أخرى.";

    }

  } finally {

    /* =====================================
       إعادة الزر إلى حالته الطبيعية
    ===================================== */

    button.disabled =
      false;


    button.textContent =
      "📩 إرسال الطلب";

  }

}


/* =========================================
   تشغيل نموذج طلب الخدمة
========================================= */

document.addEventListener(
  "DOMContentLoaded",
  function () {

    const form =
      document.getElementById(
        "serviceRequestForm"
      );


    if (!form) {
      return;
    }


    /*
       نستخدم addEventListener
       حتى لا نحتاج إلى تعديل HTML
    */

    form.addEventListener(
      "submit",
      submitServiceRequest
    );

  }
);


/* =========================================
   نهاية requests.js
========================================= */

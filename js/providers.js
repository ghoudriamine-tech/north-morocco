/* =========================================
   🏢 شمال المغرب
   طلب الانضمام كمقدم خدمة
========================================= */


/* =========================================
   إرسال طلب مقدم الخدمة
========================================= */

async function submitProviderApplication(event) {

  event.preventDefault();


  const form =
    document.getElementById(
      "providerApplicationForm"
    );


  const message =
    document.getElementById(
      "providerMessage"
    );


  const button =
    document.getElementById(
      "submitProviderBtn"
    );


  if (!form || !message || !button) {
    return;
  }


  /* ================================
     قراءة البيانات
  ================================= */

  const providerName =
    document
      .getElementById("provider_name")
      .value
      .trim();


  const serviceType =
    document
      .getElementById("provider_service_type")
      .value
      .trim();


  const city =
    document
      .getElementById("provider_city")
      .value
      .trim();


  const address =
    document
      .getElementById("provider_address")
      .value
      .trim();


  const description =
    document
      .getElementById("provider_description")
      .value
      .trim();


  const phone =
    document
      .getElementById("provider_phone")
      .value
      .trim();


  const whatsapp =
    document
      .getElementById("provider_whatsapp")
      .value
      .trim();


  const imageUrl =
    document
      .getElementById("provider_image_url")
      .value
      .trim();


  const mapUrl =
    document
      .getElementById("provider_map_url")
      .value
      .trim();


  /* ================================
     التحقق الأساسي
  ================================= */

  if (
    !providerName ||
    !serviceType ||
    !city
  ) {

    message.textContent =
      "⚠️ يرجى ملء الحقول المطلوبة.";

    return;

  }


  /* ================================
     تعطيل الزر أثناء الإرسال
  ================================= */

  button.disabled =
    true;


  button.textContent =
    "⏳ جاري إرسال الطلب...";


  message.textContent =
    "";


  /* ================================
     إرسال إلى Supabase
  ================================= */

  try {

    const response =
      await fetch(
        `${SUPABASE_URL}/rest/v1/provider_applications`,
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

            provider_name:
              providerName,

            service_type:
              serviceType,

            city:
              city,

            address:
              address || null,

            description:
              description || null,

            phone:
              phone || null,

            whatsapp:
              whatsapp || null,

            image_url:
              imageUrl || null,

            status:
              "pending"

          })

        }
      );


    /* ================================
       فحص النتيجة
    ================================= */

    if (!response.ok) {

      const errorText =
        await response.text();


      throw new Error(
        `HTTP ${response.status}: ${errorText}`
      );

    }


    /* ================================
       نجاح الطلب
    ================================= */

    message.textContent =
      "✅ تم إرسال طلبك بنجاح. ستتم مراجعة معلوماتك قبل اعتمادها.";


    form.reset();


  } catch (error) {

    console.error(
      "Provider application error:",
      error
    );


    message.textContent =
      "❌ تعذر إرسال الطلب حاليًا. يرجى المحاولة مرة أخرى.";


  } finally {

    button.disabled =
      false;


    button.textContent =
      "📩 إرسال طلب الانضمام";

  }

}


/* =========================================
   تشغيل نموذج مقدمي الخدمات
========================================= */

document.addEventListener(
  "DOMContentLoaded",
  function () {

    const form =
      document.getElementById(
        "providerApplicationForm"
      );


    if (!form) {
      return;
    }


    form.addEventListener(
      "submit",
      submitProviderApplication
    );

  }
);


/* =========================================
   نهاية providers.js
========================================= */

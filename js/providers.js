/* =========================================
   🌊 شمال المغرب
   🏢 طلبات مقدمي الخدمات
========================================= */

const ADMIN_WHATSAPP = "212616998500";


/* =========================================
   إرسال طلب مقدم الخدمة
========================================= */

async function submitProviderApplication(e) {

  e.preventDefault();

  const form =
    document.getElementById("providerApplicationForm");

  const msg =
    document.getElementById("providerMessage");

  const btn =
    document.getElementById("submitProviderBtn");


  if (!form || !msg || !btn) {
    return;
  }


  /* =====================================
     قراءة القيم
  ===================================== */

  const value = id => {

    const element =
      document.getElementById(id);

    return element
      ? element.value.trim()
      : "";

  };


  /* =====================================
     تجهيز البيانات
  ===================================== */

  const data = {

    provider_name:
      value("provider_name"),

    service_type:
      value("provider_service_type"),

    city:
      value("provider_city"),

    address:
      value("provider_address") || null,

    description:
      value("provider_description") || null,

    phone:
      value("provider_phone") || null,

    whatsapp:
      value("provider_whatsapp") || null,

    image_url:
      value("provider_image_url") || null,

    map_url:
      value("provider_map_url") || null,

    status:
      "pending"

  };


  /* =====================================
     التحقق من البيانات المطلوبة
  ===================================== */

  if (
    !data.provider_name ||
    !data.service_type ||
    !data.city
  ) {

    msg.textContent =
      "⚠️ يرجى ملء الحقول المطلوبة.";

    return;
  }


  /* =====================================
     تعطيل الزر أثناء الإرسال
  ===================================== */

  btn.disabled = true;

  btn.textContent =
    "⏳ جاري الإرسال...";

  msg.textContent = "";


  /* =====================================
     تجهيز رسالة واتساب
  ===================================== */

  const whatsappMessage =
`🏢 طلب مقدم خدمة جديد

👤 الاسم: ${data.provider_name}

🧭 نوع الخدمة: ${data.service_type}

📍 المدينة: ${data.city}

🏠 العنوان: ${data.address || "غير محدد"}

📞 الهاتف: ${data.phone || "غير محدد"}

💬 واتساب: ${data.whatsapp || "غير محدد"}

📝 وصف الخدمة:
${data.description || "لا يوجد"}

🔗 رابط الصورة:
${data.image_url || "لا يوجد"}

📍 رابط الموقع:
${data.map_url || "لا يوجد"}`;


  /* =====================================
     رابط واتساب
  ===================================== */

  const whatsappURL =
    "https://wa.me/" +
    ADMIN_WHATSAPP +
    "?text=" +
    encodeURIComponent(
      whatsappMessage
    );


  /* =====================================
     حفظ الطلب في Supabase
  ===================================== */

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
            JSON.stringify(data)
        }
      );


    /* ===================================
       فشل Supabase
    =================================== */

    if (!response.ok) {

      const errorText =
        await response.text();

      throw new Error(
        errorText ||
        `HTTP ${response.status}`
      );

    }


    /* ===================================
       نجاح الحفظ
    =================================== */

    msg.textContent =
      "✅ تم إرسال الطلب بنجاح. سيتم فتح واتساب...";


    /* ===================================
       فتح واتساب مباشرة
    =================================== */

    window.location.href =
      whatsappURL;


    /* ===================================
       تفريغ النموذج
    =================================== */

    form.reset();


  } catch (error) {

    console.error(
      "❌ Provider application error:",
      error
    );


    msg.textContent =
      "❌ تعذر إرسال الطلب حاليًا. يرجى المحاولة مرة أخرى.";

  } finally {

    btn.disabled = false;

    btn.textContent =
      "📩 إرسال";

  }

}


/* =========================================
   تشغيل النموذج
========================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    const form =
      document.getElementById(
        "providerApplicationForm"
      );


    if (!form) {
      return;
    }


    /* منع تكرار ربط النموذج */

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
      submitProviderApplication
    );

  }
);

/* =========================================
   🌊 شمال المغرب
   🏢 طلبات مقدمي الخدمات
========================================= */

async function submitProviderApplication(e) {
  e.preventDefault();

  const form =
    document.getElementById("providerApplicationForm");

  const msg =
    document.getElementById("providerMessage");

  const btn =
    document.getElementById("submitProviderBtn");

  if (!form || !msg || !btn) return;

  const value = id =>
    document.getElementById(id)?.value.trim() || "";

  const data = {
    provider_name: value("provider_name"),
    service_type: value("provider_service_type"),
    city: value("provider_city"),
    address: value("provider_address") || null,
    description: value("provider_description") || null,
    phone: value("provider_phone") || null,
    whatsapp: value("provider_whatsapp") || null,
    image_url: value("provider_image_url") || null,
    status: "pending"
  };

  if (!data.provider_name || !data.service_type || !data.city) {
    msg.textContent = "⚠️ يرجى ملء الحقول المطلوبة.";
    return;
  }

  btn.disabled = true;
  btn.textContent = "⏳ جاري الإرسال...";
  msg.textContent = "";

  try {

    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/provider_applications`,
      {
        method: "POST",

        headers: {
          ...supabaseHeaders(),
          Prefer: "return=minimal"
        },

        body: JSON.stringify(data)
      }
    );

    if (!response.ok) {
      throw new Error(await response.text());
    }

    /* =====================================
       تم الحفظ بنجاح
    ===================================== */

    msg.textContent =
      "✅ تم إرسال طلبك بنجاح. سيتم فتح واتساب...";


    /* =====================================
       رسالة واتساب
    ===================================== */

    const whatsappMessage =
`🏢 طلب مقدم خدمة جديد

👤 الاسم: ${data.provider_name}
🧭 نوع الخدمة: ${data.service_type}
📍 المدينة: ${data.city}
🏠 العنوان: ${data.address || "غير محدد"}
📞 الهاتف: ${data.phone || "غير محدد"}
💬 واتساب: ${data.whatsapp || "غير محدد"}

📝 الوصف:
${data.description || "لا يوجد"}

🔗 الصورة:
${data.image_url || "لا يوجد"}`;


    /* =====================================
       فتح واتساب
       الرقم: 0616998500
    ===================================== */

    window.location.href =
      "https://wa.me/212616998500?text=" +
      encodeURIComponent(whatsappMessage);


    form.reset();

  } catch (error) {

    console.error(
      "Provider application error:",
      error
    );

    msg.textContent =
      "❌ تعذر إرسال الطلب حاليًا. يرجى المحاولة مرة أخرى.";

  } finally {

    btn.disabled = false;
    btn.textContent = "📩 إرسال";

  }
}


/* =========================================
   تشغيل النموذج
========================================= */

document.addEventListener("DOMContentLoaded", () => {

  const form =
    document.getElementById(
      "providerApplicationForm"
    );

  if (
    form &&
    form.dataset.initialized !== "true"
  ) {

    form.dataset.initialized = "true";

    form.addEventListener(
      "submit",
      submitProviderApplication
    );

  }

});

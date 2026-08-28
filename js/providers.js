async function submitProviderApplication(e) {
  e.preventDefault();

  const form = document.getElementById("providerApplicationForm");
  const msg = document.getElementById("providerMessage");
  const btn = document.getElementById("submitProviderBtn");

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
          apikey: SUPABASE_KEY,
          "Content-Type": "application/json",
          Prefer: "return=minimal"
        },
        body: JSON.stringify(data)
      }
    );

    if (!response.ok) {
      throw new Error(await response.text());
    }

    msg.textContent =
      "✅ تم إرسال طلبك بنجاح. ستتم مراجعة معلوماتك قبل اعتمادها.";

    form.reset();

  } catch (error) {
    console.error("Provider application error:", error);
    msg.textContent =
      "❌ تعذر إرسال الطلب حاليًا. يرجى المحاولة مرة أخرى.";

  } finally {
    btn.disabled = false;
    btn.textContent = "📩 إرسال";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("providerApplicationForm");

  if (form) {
    form.addEventListener("submit", submitProviderApplication);
  }
});

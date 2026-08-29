function selectService(type, id, name) {
  const serviceType = document.getElementById("service_type");
  const serviceId = document.getElementById("service_id");
  const notes = document.getElementById("notes");

  if (!serviceType || !serviceId) return;

  serviceType.value = String(type || "");
  serviceId.value = String(id || "");

  if (notes) {
    notes.value = `أرغب في طلب خدمة: ${String(name || "")}`;
  }

  const section = document.getElementById("services-actions");

  if (section) {
    section.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }
}

async function submitServiceRequest(e) {
  e.preventDefault();

  const form = document.getElementById("serviceRequestForm");
  const msg = document.getElementById("requestMessage");
  const btn = document.getElementById("submitRequestBtn");

  if (!form || !msg || !btn) return;

  const value = id =>
    document.getElementById(id)?.value.trim() || "";

  const serviceId = Number(value("service_id"));

  const data = {
    requester_name: value("requester_name"),
    phone: value("phone") || null,
    whatsapp: value("whatsapp") || null,
    service_type: value("service_type"),
    service_id: serviceId,
    request_date: value("request_date") || null,
    notes: value("notes") || null
  };

  if (!data.requester_name) {
    msg.textContent = "⚠️ يرجى كتابة الاسم.";
    return;
  }

  if (!data.service_type) {
    msg.textContent = "⚠️ يرجى اختيار نوع الخدمة.";
    return;
  }

  if (!Number.isInteger(serviceId) || serviceId <= 0) {
    msg.textContent = "⚠️ يرجى اختيار الخدمة أولاً.";
    return;
  }

  btn.disabled = true;
  btn.textContent = "⏳ جاري الإرسال...";
  msg.textContent = "";

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/service_requests`,
      {
        method: "POST",
        headers: {
          apikey: SUPABASE_KEY,
          "Content-Type": "application/json",
          Prefer: "return=minimal"
        },
        body: JSON.stringify(data),
        signal: controller.signal
      }
    );

    if (!response.ok) {
      throw new Error(await response.text());
    }

    msg.textContent =
      "✅ تم إرسال طلبك بنجاح، سنتواصل معك قريبًا.";

    form.reset();

  } catch (error) {
    console.error("Service request error:", error);

    msg.textContent =
      error.name === "AbortError"
        ? "❌ انتهت مهلة إرسال الطلب. يرجى المحاولة مرة أخرى."
        : "❌ تعذر إرسال الطلب حاليًا. يرجى المحاولة مرة أخرى.";

  } finally {
    clearTimeout(timeout);
    btn.disabled = false;
    btn.textContent = "📩 إرسال";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("serviceRequestForm");

  if (form) {
    form.addEventListener("submit", submitServiceRequest);
  }
});

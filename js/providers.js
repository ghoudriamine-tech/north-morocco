/* =========================================
🏢 شمال المغرب — مقدمو الخدمات
========================================= */

async function submitProviderApplication(event) {
event.preventDefault();

const form = document.getElementById("providerApplicationForm");
const message = document.getElementById("providerMessage");
const button = document.getElementById("submitProviderBtn");

if (!form || !message || !button) return;

const getValue = id =>
document.getElementById(id)?.value.trim() || "";

const data = {
provider_name: getValue("provider_name"),
service_type: getValue("provider_service_type"),
city: getValue("provider_city"),
address: getValue("provider_address") || null,
description: getValue("provider_description") || null,
phone: getValue("provider_phone") || null,
whatsapp: getValue("provider_whatsapp") || null,
image_url: getValue("provider_image_url") || null,
map_url: getValue("provider_map_url") || null,
status: "pending"
};

if (
!data.provider_name ||
!data.service_type ||
!data.city
) {
message.textContent =
"⚠️ يرجى ملء الحقول المطلوبة.";
return;
}

if (button.disabled) return;

button.disabled = true;
button.textContent = "⏳ جاري إرسال الطلب...";
message.textContent = "";

try {
const response = await fetch(
"${SUPABASE_URL}/rest/v1/provider_applications",
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
  throw new Error(
    `HTTP ${response.status}: ${await response.text()}`
  );
}

message.textContent =
  "✅ تم إرسال طلبك بنجاح. ستتم مراجعة معلوماتك قبل اعتمادها.";

form.reset();

} catch (error) {
console.error("Provider application error:", error);

message.textContent =
  "❌ تعذر إرسال الطلب حاليًا. يرجى المحاولة مرة أخرى.";

} finally {
button.disabled = false;
button.textContent = "📩 إرسال طلب الانضمام";
}
}

document.addEventListener("DOMContentLoaded", () => {
const form =
document.getElementById("providerApplicationForm");

if (form) {
form.addEventListener(
"submit",
submitProviderApplication
);
}
});

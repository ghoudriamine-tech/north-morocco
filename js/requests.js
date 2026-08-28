/* =========================================
📋 شمال المغرب — طلب الخدمة
========================================= */

function selectService(type, id, name) {
const serviceType = document.getElementById("service_type");
const serviceId = document.getElementById("service_id");
const notes = document.getElementById("notes");
const section = document.getElementById("request");

if (!serviceType || !serviceId) return;

serviceType.value = String(type || "");
serviceId.value = String(id || "");

if (notes) {
notes.value = "أرغب في طلب خدمة: ${String(name || "")}";
}

if (section) {
section.scrollIntoView({
behavior: "smooth",
block: "start"
});
}
}

async function submitServiceRequest(event) {
event.preventDefault();

const form = document.getElementById("serviceRequestForm");
const message = document.getElementById("requestMessage");
const button = document.getElementById("submitRequestBtn");

if (!form || !message || !button) return;
if (button.disabled) return;

const get = id =>
document.getElementById(id)?.value.trim() || "";

const serviceId = Number(get("service_id"));

const data = {
requester_name: get("requester_name"),
phone: get("phone") || null,
whatsapp: get("whatsapp") || null,
service_type: get("service_type"),
service_id: serviceId,
request_date: document.getElementById("request_date")?.value || null,
notes: get("notes") || null
};

if (!data.requester_name) {
message.textContent = "⚠️ يرجى كتابة الاسم.";
return;
}

if (!data.service_type) {
message.textContent = "⚠️ يرجى اختيار نوع الخدمة.";
return;
}

if (!Number.isInteger(serviceId) || serviceId <= 0) {
message.textContent = "⚠️ يرجى اختيار الخدمة أولاً.";
return;
}

button.disabled = true;
button.textContent = "⏳ جاري إرسال الطلب...";
message.textContent = "";

const controller = new AbortController();

const timeout = setTimeout(
() => controller.abort(),
10000
);

try {
const response = await fetch(
"${SUPABASE_URL}/rest/v1/service_requests",
{
method: "POST",
headers: {
...supabaseHeaders(),
Prefer: "return=minimal"
},
body: JSON.stringify(data),
signal: controller.signal
}
);

if (!response.ok) {
  throw new Error(
    `HTTP ${response.status}: ${await response.text()}`
  );
}

message.textContent =
  "✅ تم إرسال طلبك بنجاح، سنتواصل معك قريبًا.";

form.reset();

} catch (error) {
console.error("Service request error:", error);

message.textContent =
  error.name === "AbortError"
    ? "❌ انتهت مهلة إرسال الطلب. يرجى المحاولة مرة أخرى."
    : "❌ تعذر إرسال الطلب حاليًا. يرجى المحاولة مرة أخرى.";

} finally {
clearTimeout(timeout);
button.disabled = false;
button.textContent = "📩 إرسال الطلب";
}
}

document.addEventListener("DOMContentLoaded", () => {
const form = document.getElementById("serviceRequestForm");

if (form) {
form.addEventListener(
"submit",
submitServiceRequest
);
}
});

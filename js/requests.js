/* =========================================
   📋 طلب الخدمة
========================================= */

function selectService(
  serviceType,
  serviceId,
  serviceName
) {

  const type =
    document.getElementById("service_type");

  const id =
    document.getElementById("service_id");

  const notes =
    document.getElementById("notes");

  if (!type || !id) return;

  type.value = serviceType;

  id.value = serviceId;

  if (notes) {
    notes.value =
      "أرغب في طلب خدمة: " +
      serviceName;
  }

  const requestSection =
    document.getElementById("request");

  if (requestSection) {

    requestSection.scrollIntoView({
      behavior: "smooth"
    });

  }
}


/* =========================================
   إرسال الطلب إلى Supabase
========================================= */

async function submitServiceRequest(event) {

  event.preventDefault();

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

  if (!form || !message || !button) {
    return;
  }


  const requesterName =
    document
      .getElementById("requester_name")
      .value
      .trim();

  const phone =
    document
      .getElementById("phone")
      .value
      .trim();

  const whatsapp =
    document
      .getElementById("whatsapp")
      .value
      .trim();

  const serviceType =
    document
      .getElementById("service_type")
      .value;

  const serviceId =
    document
      .getElementById("service_id")
      .value;

  const requestDate =
    document
      .getElementById("request_date")
      .value;

  const notes =
    document
      .getElementById("notes")
      .value
      .trim();


  if (
    !requesterName ||
    !serviceType ||
    !serviceId
  ) {

    message.textContent =
      "⚠️ يرجى ملء الحقول المطلوبة.";

    return;
  }


  button.disabled = true;

  button.textContent =
    "⏳ جاري إرسال الطلب...";

  message.textContent = "";


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
              Number(serviceId),

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

          })
        }
      );


    if (!response.ok) {

      const errorText =
        await response.text();

      throw new Error(
        `HTTP ${response.status}: ${errorText}`
      );
    }


    message.textContent =
      "✅ تم إرسال طلبك بنجاح، سنتواصل معك قريبًا.";

    form.reset();


  } catch (error) {

    console.error(
      "Service request error:",
      error
    );

    message.textContent =
      "❌ خطأ: " +
      error.message;


  } finally {

    button.disabled = false;

    button.textContent =
      "📩 إرسال الطلب";
  }
    }

const SUPABASE_URL = "https://rbmttbxsezttysenbcwn.supabase.co";
const SUPABASE_KEY = "sb_publishable_tVChEdNRQHs9lrYPjA4ajQ_heTXT2w";

const headers = {
  apikey: SUPABASE_KEY,
  "Content-Type": "application/json"
};

const get = table =>
  fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*`, { headers })
    .then(r => {
      if (!r.ok) throw new Error(r.status);
      return r.json();
    });

const esc = v =>
  String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const stars = n => {
  n = Math.max(0, Math.min(5, Math.round(Number(n) || 0)));
  return "★".repeat(n) + "☆".repeat(5 - n);
};

const whatsapp = n => {
  n = String(n || "").replace(/\D/g, "");
  return n.startsWith("0") ? "212" + n.slice(1) : n;
};


/* =========================
   الإقامات
========================= */

async function loadAccommodations() {
  try {
    const [data, providers, reviews] = await Promise.all([
      get("accommodations"),
      get("providers").catch(() => []),
      get("reviews").catch(() => [])
    ]);

    showStay("apartmentsList", data, ["شقق مفروشة", "شقة مفروشة", "apartment"], providers, reviews);
    showStay("hotelsList", data, ["فنادق", "فندق", "hotel"], providers, reviews);
    showStay("riadsList", data, ["رياضات", "رياض", "riad"], providers, reviews);

  } catch (e) {
    console.error(e);
    ["apartmentsList", "hotelsList", "riadsList"].forEach(showError);
  }
}

function showStay(id, data, types, providers, reviews) {
  const box = document.getElementById(id);
  if (!box) return;

  const items = data.filter(x =>
    types.includes(String(x.type || "").trim().toLowerCase())
  );

  if (!items.length) {
    box.innerHTML = `<p class="empty">لا توجد خدمات حالياً.</p>`;
    return;
  }

  box.innerHTML = items.map(item => card(item, providers, reviews)).join("");
}


/* =========================
   بطاقة الإقامة
========================= */

function card(item, providers, reviews) {
  const id = item.id;
  const phone = String(item.phone || "").trim();
  const wa = whatsapp(item.whatsapp || phone);

  const provider = providers.find(
    p => String(p.id) === String(item.provider_id)
  );

  const rv = reviews.filter(r =>
    String(r.service_type || "").toLowerCase() === "accommodation" &&
    String(r.service_id) === String(id)
  );

  const avg = rv.length
    ? rv.reduce((s, r) => s + Number(r.rating || 0), 0) / rv.length
    : 0;

  return `
    <div class="accommodation-card">

      ${item.image_url ? `
        <img src="${esc(item.image_url)}"
             alt="${esc(item.name)}"
             class="accommodation-image"
             loading="lazy">
      ` : ""}

      <h3>${esc(item.name || "إقامة")}</h3>

      ${item.city ? `<p>📍 ${esc(item.city)}</p>` : ""}
      ${item.address ? `<p>📌 ${esc(item.address)}</p>` : ""}
      ${item.description ? `<p>${esc(item.description)}</p>` : ""}

      ${(item.price_per_night ?? item.price) !== null &&
       (item.price_per_night ?? item.price) !== undefined
        ? `<p>💰 ${esc(item.price_per_night ?? item.price)} درهم / ليلة</p>`
        : ""}

      <div class="accommodation-buttons">

        ${phone ? `<a class="btn" href="tel:${esc(phone)}">📞</a>` : ""}

        ${wa ? `
          <a class="btn whatsapp-accommodation"
             href="https://wa.me/${wa}"
             target="_blank">💬</a>
        ` : ""}

        ${item.map_url ? `
          <a class="btn"
             href="${esc(item.map_url)}"
             target="_blank">📍</a>
        ` : ""}

        <button class="btn"
          onclick="toggleCardSection('provider-${id}',this)">🏢</button>

        <button class="btn"
          onclick="toggleCardSection('reviews-${id}',this)">⭐</button>

        <button class="btn"
          onclick="selectService('accommodation','${esc(id)}','${esc(item.name)}')">📋</button>

      </div>

      <div id="provider-${id}" class="card-toggle-section">
        <div class="provider-details">
          ${
            provider
              ? `
                <h4>🏢 ${esc(provider.name || "مقدم الخدمة")}</h4>
                ${provider.city ? `<p>📍 ${esc(provider.city)}</p>` : ""}
                ${provider.address ? `<p>📌 ${esc(provider.address)}</p>` : ""}
                ${provider.phone ? `<p>📞 ${esc(provider.phone)}</p>` : ""}
                ${provider.description ? `<p>${esc(provider.description)}</p>` : ""}
              `
              : `<p>لا توجد معلومات مقدم الخدمة حالياً.</p>`
          }
        </div>
      </div>

      <div id="reviews-${id}" class="card-toggle-section">
        <div class="card-reviews">

          <strong>⭐ التقييم</strong>

          ${
            rv.length
              ? `<p>${stars(avg)} ${avg.toFixed(1)}/5 · ${rv.length} تقييم</p>`
              : `<p>لا توجد تقييمات بعد.</p>`
          }

          ${rv.map(r => `
            <div class="review-item">
              <strong>${esc(r.reviewer_name || "مستخدم")}</strong>
              <div>${stars(r.rating)}</div>
              ${r.comment ? `<p>💬 ${esc(r.comment)}</p>` : ""}
            </div>
          `).join("")}

        </div>
      </div>

    </div>
  `;
}


/* =========================
   المواصلات
========================= */

async function loadTransportServices() {
  try {
    const data = await get("transport_services");

    showTransport(
      "carRentalList",
      data,
      ["car_rental", "car rental", "كراء السيارات", "تأجير السيارات"]
    );

    showTransport(
      "taxiList",
      data,
      ["taxi", "سيارات الأجرة", "سيارة أجرة"]
    );

    showTransport(
      "busList",
      data,
      ["bus", "tourist_bus", "حافلات", "حافلات سياحية صغيرة", "الحافلات السياحية الصغيرة"]
    );

  } catch (e) {
    console.error(e);
    ["carRentalList", "taxiList", "busList"].forEach(showError);
  }
}

function showTransport(id, data, types) {
  const box = document.getElementById(id);
  if (!box) return;

  const items = data.filter(x =>
    types.includes(String(
      x.service_type || x.type || x.category || x.transport_type || ""
    ).trim().toLowerCase())
  );

  box.innerHTML = items.length
    ? items.map(transportCard).join("")
    : `<p class="empty">لا توجد خدمات حالياً.</p>`;
}

function transportCard(item) {
  const name = item.name || item.title || "خدمة نقل";
  const phone = String(item.phone || "").trim();
  const wa = whatsapp(item.whatsapp || phone);

  return `
    <div class="accommodation-card">

      ${item.image_url ? `
        <img src="${esc(item.image_url)}"
             class="accommodation-image"
             alt="${esc(name)}">
      ` : ""}

      <h3>${esc(name)}</h3>

      ${item.city ? `<p>📍 ${esc(item.city)}</p>` : ""}
      ${item.description ? `<p>${esc(item.description)}</p>` : ""}

      <div class="accommodation-buttons">

        ${phone ? `<a class="btn" href="tel:${esc(phone)}">📞</a>` : ""}

        ${wa ? `
          <a class="btn"
             href="https://wa.me/${wa}"
             target="_blank">💬</a>
        ` : ""}

        ${item.map_url ? `
          <a class="btn"
             href="${esc(item.map_url)}"
             target="_blank">📍</a>
        ` : ""}

        <button class="btn"
          onclick="selectService('transport','${esc(item.id)}','${esc(name)}')">
          📋
        </button>

      </div>
    </div>
  `;
}


/* =========================
   فتح وإغلاق الأيقونات
========================= */

function toggleCardSection(id, btn) {
  const box = document.getElementById(id);
  if (!box) return;

  const open = box.classList.toggle("show");

  if (btn)
    btn.setAttribute("aria-expanded", open);
}


/* =========================
   طلب الخدمة
========================= */

function selectService(type, id, name) {
  const t = document.getElementById("service_type");
  const i = document.getElementById("service_id");
  const n = document.getElementById("notes");
  const section = document.getElementById("request");

  if (!t || !i) return;

  t.value = type;
  i.value = id;

  if (n)
    n.value = `أرغب في طلب خدمة: ${name}`;

  if (section) {
    section.classList.add("show", "visible-request");
    section.classList.remove("hidden-request");
    section.scrollIntoView({ behavior: "smooth" });
  }
}


/* =========================
   إرسال الطلب
========================= */

async function submitServiceRequest(e) {
  e.preventDefault();

  const form = document.getElementById("serviceRequestForm");
  const msg = document.getElementById("requestMessage");
  const btn = document.getElementById("submitRequestBtn");

  const data = {
    requester_name: document.getElementById("requester_name")?.value.trim(),
    phone: document.getElementById("phone")?.value.trim() || null,
    whatsapp: document.getElementById("whatsapp")?.value.trim() || null,
    service_type: document.getElementById("service_type")?.value.trim(),
    service_id: Number(document.getElementById("service_id")?.value),
    request_date: document.getElementById("request_date")?.value || null,
    notes: document.getElementById("notes")?.value.trim() || null
  };

  if (!data.requester_name || !data.service_type || !data.service_id) {
    msg.textContent = "⚠️ يرجى اختيار الخدمة وملء الاسم.";
    return;
  }

  btn.disabled = true;
  btn.textContent = "⏳ جاري الإرسال...";

  try {
    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/service_requests`,
      {
        method: "POST",
        headers: {
          ...headers,
          Prefer: "return=minimal"
        },
        body: JSON.stringify(data)
      }
    );

    if (!r.ok) throw new Error(await r.text());

    msg.textContent = "✅ تم إرسال طلبك بنجاح، سنتواصل معك قريبًا.";
    form.reset();

  } catch (e) {
    console.error(e);
    msg.textContent = "❌ تعذر إرسال الطلب حالياً.";
  }

  btn.disabled = false;
  btn.textContent = "📩 إرسال الطلب";
}


/* =========================
   خطأ
========================= */

function showError(id) {
  const box = document.getElementById(id);
  if (box)
    box.innerHTML = `<p class="empty">تعذر تحميل البيانات حالياً.</p>`;
}


/* =========================
   التشغيل
========================= */

document.addEventListener("DOMContentLoaded", () => {

  loadAccommodations();
  loadTransportServices();

  const request = document.getElementById("request");

  if (request)
    request.classList.add("hidden-request");

  const form = document.getElementById("serviceRequestForm");

  if (form)
    form.addEventListener("submit", submitServiceRequest);

});
